import fs from 'fs';
import path from 'path';
import {
  ensureDir,
  randomHex,
  readJson,
  writeJson,
} from './utils.mjs';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }
    const key = token.slice(2);
    if (!key) {
      throw new Error('Empty flag provided.');
    }

    const value = argv[i + 1];
    if (value && !value.startsWith('--')) {
      args[key] = value;
      i += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function slugify(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'edition';
}

function resolveBoardPath(publicDir, filePath) {
  const trimmed = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return path.join(publicDir, trimmed);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const title = args.title;
  if (!title) {
    throw new Error('Missing required --title "Edition Title".');
  }

  const repoRoot = process.cwd();
  const publicDir = path.join(repoRoot, 'public');
  const boardsDir = path.join(publicDir, 'data', 'boards');
  const indexPath = path.join(boardsDir, 'index.json');

  if (!fs.existsSync(indexPath)) {
    throw new Error(`Board index missing: ${indexPath}`);
  }

  const indexPayload = await readJson(indexPath);
  if (!Array.isArray(indexPayload?.boards)) {
    throw new Error('Invalid index.json: expected "boards" array.');
  }

  const today = new Date().toISOString().slice(0, 10);
  const fromId = args.from || indexPayload.defaultBoardId || 'default';
  const fromEntry = indexPayload.boards.find((entry) => entry.id === fromId);
  const sourceFile = fromEntry?.file || `/data/boards/${fromId}.json`;
  const sourcePath = resolveBoardPath(publicDir, sourceFile);

  let boardPayload;
  if (args.local) {
    const localPath = path.resolve(args.local);
    if (!fs.existsSync(localPath)) {
      throw new Error(`Local override not found: ${localPath}`);
    }
    boardPayload = await readJson(localPath);
  } else {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Board file missing: ${sourcePath}`);
    }
    boardPayload = await readJson(sourcePath);
  }

  const base = slugify(`${title}-${today}`);
  const existingIds = new Set(indexPayload.boards.map((entry) => entry.id));
  let editionId = `${base}-${randomHex(2)}`;
  let attempts = 0;
  while (existingIds.has(editionId)) {
    attempts += 1;
    if (attempts > 10) {
      throw new Error('Unable to generate unique edition id.');
    }
    editionId = `${base}-${randomHex(2)}`;
  }

  const editionPath = path.join(boardsDir, `${editionId}.json`);
  if (fs.existsSync(editionPath) && !args.force) {
    throw new Error(
      `Edition file already exists: ${editionPath} (use --force to overwrite)`,
    );
  }

  ensureDir(boardsDir);
  await writeJson(editionPath, boardPayload);

  const tags = (args.tags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  const newEntry = {
    id: editionId,
    title,
    file: `/data/boards/${editionId}.json`,
    created: today,
    updated: today,
    tags,
  };

  indexPayload.boards.push(newEntry);

  if (args['touch-default']) {
    const defaultEntry = indexPayload.boards.find(
      (entry) => entry.id === indexPayload.defaultBoardId,
    );
    if (defaultEntry) {
      defaultEntry.updated = today;
    }
  }

  await writeJson(indexPath, indexPayload);

  console.log(`Published edition ${editionId}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
