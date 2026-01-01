import path from 'path';
import { promises as fsp } from 'fs';
import {
  copyWithCollision,
  createExcerpt,
  ensureDir,
  parseArgs,
  randomHex,
  readJson,
  resolveSitePath,
  toNumber,
  writeJson,
} from './utils.mjs';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');
const THUMBS_DIR = path.join(ASSETS_DIR, 'thumbs');
const FULL_DIR = path.join(ASSETS_DIR, 'full');
const BOARD_PATH = path.join(DATA_DIR, 'boards', 'default.json');
const ARTIFACTS_PATH = path.join(DATA_DIR, 'artifacts.json');

const TYPE_PREFIX = {
  image: 'img',
  text: 'txt',
  video: 'vid',
};

function usageError(message) {
  throw new Error(message);
}

function requireFlag(args, key) {
  if (!args[key]) {
    usageError(`Missing required flag: --${key}`);
  }
}

function validateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    usageError('Date must be in YYYY-MM-DD format.');
  }
}

function parseTags(value) {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags.length === 0) {
    usageError('Tags must include at least one value.');
  }
  return tags;
}

function generateArtifactId(date, type, existingIds) {
  const compactDate = date.replace(/-/g, '');
  const prefix = TYPE_PREFIX[type];
  if (!prefix) {
    usageError(`Unsupported type: ${type}`);
  }

  for (let i = 0; i < 20; i += 1) {
    const candidate = `a-${prefix}-${compactDate}-${randomHex(2)}`;
    if (!existingIds.has(candidate)) {
      return candidate;
    }
  }

  usageError('Unable to generate unique artifact id.');
  return '';
}

function generateNodeId(existingIds) {
  for (let i = 0; i < 20; i += 1) {
    const candidate = `n-${randomHex(2)}`;
    if (!existingIds.has(candidate)) {
      return candidate;
    }
  }

  usageError('Unable to generate unique node id.');
  return '';
}

function buildDropPosition(args) {
  const x = toNumber(args.x, '--x');
  const y = toNumber(args.y, '--y');

  if (x !== undefined || y !== undefined) {
    return {
      x: x ?? 0,
      y: y ?? 0,
    };
  }

  const spread = 120;
  const jitter = () => Math.round((Math.random() - 0.5) * spread);
  return { x: jitter(), y: jitter() };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));

    requireFlag(args, 'type');
    requireFlag(args, 'title');
    requireFlag(args, 'tags');
    requireFlag(args, 'date');

    validateDate(args.date);

    const type = args.type;
    if (!['image', 'text', 'video'].includes(type)) {
      usageError(`Type must be one of: image, text, video.`);
    }

    const tags = parseTags(args.tags);

    if (type === 'image') {
      requireFlag(args, 'thumb');
      requireFlag(args, 'full');
    }

    if (type === 'video') {
      requireFlag(args, 'thumb');
      requireFlag(args, 'youtubeId');
    }

    if (type === 'text') {
      requireFlag(args, 'body');
    }

    const artifactsData = await readJson(ARTIFACTS_PATH);
    if (!Array.isArray(artifactsData.artifacts)) {
      usageError('artifacts.json does not contain an artifacts array.');
    }

    const existingIds = new Set(artifactsData.artifacts.map((artifact) => artifact.id));
    const newId = generateArtifactId(args.date, type, existingIds);

    const artifact = {
      id: newId,
      type,
      title: args.title,
      tags,
      date: args.date,
    };

    if (type === 'image') {
      const thumbPath = await copyWithCollision(args.thumb, THUMBS_DIR);
      const fullPath = await copyWithCollision(args.full, FULL_DIR);
      artifact.thumb = resolveSitePath(PUBLIC_DIR, thumbPath);
      artifact.full = resolveSitePath(PUBLIC_DIR, fullPath);
    }

    if (type === 'video') {
      const thumbPath = await copyWithCollision(args.thumb, THUMBS_DIR);
      artifact.thumb = resolveSitePath(PUBLIC_DIR, thumbPath);
      artifact.youtubeId = args.youtubeId;
    }

    if (type === 'text') {
      const bodyPath = path.resolve(args.body);
      const body = await fsp.readFile(bodyPath, 'utf8');
      artifact.body = body;
      artifact.excerpt = args.excerpt ? args.excerpt : createExcerpt(body);
    }

    artifactsData.artifacts.push(artifact);
    await writeJson(ARTIFACTS_PATH, artifactsData);

    if (args.drop) {
      ensureDir(path.dirname(BOARD_PATH));
      const boardData = await readJson(BOARD_PATH);
      if (!Array.isArray(boardData.nodes)) {
        usageError('default.json does not contain a nodes array.');
      }
      const existingNodeIds = new Set(boardData.nodes.map((node) => node.id));
      const nodeId = generateNodeId(existingNodeIds);
      const size = type === 'text' ? { w: 320, h: 220 } : { w: 280, h: 220 };
      const position = buildDropPosition(args);
      const node = {
        id: nodeId,
        artifactId: newId,
        x: position.x,
        y: position.y,
        w: size.w,
        h: size.h,
      };
      boardData.nodes.push(node);
      await writeJson(BOARD_PATH, boardData);
    }

    console.log(`Added artifact ${newId}.`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

await main();
