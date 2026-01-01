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
const FRAME_VARIANTS = new Set(['thinBlack', 'floatMount', 'none']);
const MAT_VALUES = new Set([0, 8, 16, 24]);

function usageError(message) {
  throw new Error(message);
}

function requireFlag(args, key) {
  if (!args[key]) {
    usageError(`Missing required flag: --${key}`);
  }
}

function validateDate(date) {
  if (!/^\d{4}(-\d{2}-\d{2})?$/.test(date)) {
    usageError('Date must be in YYYY or YYYY-MM-DD format.');
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

function parseMat(value, label) {
  if (value === undefined) {
    return undefined;
  }
  const mat = toNumber(value, label);
  if (!MAT_VALUES.has(mat)) {
    usageError(`${label} must be one of: 0, 8, 16, 24.`);
  }
  return mat;
}

function resolveFrameConfig(variantValue, matValue, labelPrefix) {
  if (!variantValue) {
    if (matValue !== undefined) {
      usageError(`--${labelPrefix}-mat requires --${labelPrefix}-frame.`);
    }
    return null;
  }

  if (!FRAME_VARIANTS.has(variantValue)) {
    usageError(
      `--${labelPrefix}-frame must be one of: thinBlack, floatMount, none.`
    );
  }

  const mat = parseMat(matValue, `--${labelPrefix}-mat`);
  if (mat !== undefined) {
    return { variant: variantValue, mat };
  }

  const defaultMat = variantValue === 'floatMount' ? 16 : 0;
  return { variant: variantValue, mat: defaultMat };
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

function resolveDate(args) {
  if (args.date && args.year) {
    usageError('Use either --date or --year, not both.');
  }
  const date = args.date ?? args.year;
  if (!date) {
    usageError('Missing required flag: --date (or --year).');
  }
  validateDate(date);
  return date;
}

function resolveArtifactsArray(artifactsData) {
  if (Array.isArray(artifactsData)) {
    return artifactsData;
  }
  if (Array.isArray(artifactsData.artifacts)) {
    return artifactsData.artifacts;
  }
  usageError('artifacts.json does not contain an artifacts array.');
  return [];
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));

    requireFlag(args, 'type');
    requireFlag(args, 'title');
    requireFlag(args, 'tags');
    const date = resolveDate(args);

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
    const artifacts = resolveArtifactsArray(artifactsData);

    const existingIds = new Set(artifacts.map((artifact) => artifact.id));
    const newId = generateArtifactId(date, type, existingIds);
    const frameConfig = resolveFrameConfig(args.frame, args.mat, 'frame');

    const artifact = {
      id: newId,
      type,
      title: args.title,
      tags,
      date,
    };

    if (args.medium) {
      artifact.medium = args.medium;
    }

    if (args.dimensions) {
      artifact.dimensions = args.dimensions;
    }

    if (args.caption) {
      artifact.caption = args.caption;
    }

    if (frameConfig) {
      artifact.frame = frameConfig;
    }

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

    artifacts.push(artifact);
    await writeJson(ARTIFACTS_PATH, artifactsData);

    if (args.drop) {
      ensureDir(path.dirname(BOARD_PATH));
      const boardData = await readJson(BOARD_PATH);
      if (!Array.isArray(boardData.nodes)) {
        usageError('default.json does not contain a nodes array.');
      }
      const existingNodeIds = new Set(boardData.nodes.map((node) => node.id));
      const nodeId = generateNodeId(existingNodeIds);
      const sizeDefaults = type === 'text' ? { w: 320, h: 220 } : { w: 280, h: 220 };
      const w = toNumber(args.w, '--w');
      const h = toNumber(args.h, '--h');
      const position = buildDropPosition(args);
      const nodeFrameOverride = resolveFrameConfig(
        args['node-frame'],
        args['node-mat'],
        'node'
      );
      const node = {
        id: nodeId,
        artifactId: newId,
        x: position.x,
        y: position.y,
        w: w ?? sizeDefaults.w,
        h: h ?? sizeDefaults.h,
      };
      if (nodeFrameOverride) {
        node.frameOverride = nodeFrameOverride;
      }
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
