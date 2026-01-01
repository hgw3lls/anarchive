import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { promises as fsp } from 'fs';

export function parseArgs(argv) {
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

    if (key === 'drop') {
      args.drop = true;
      continue;
    }

    const value = argv[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    i += 1;
  }

  return args;
}

export function randomHex(bytes = 2) {
  return crypto.randomBytes(bytes).toString('hex');
}

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function readJson(filePath) {
  const raw = await fsp.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

export async function writeJson(filePath, data) {
  const payload = `${JSON.stringify(data, null, 2)}\n`;
  await fsp.writeFile(filePath, payload, 'utf8');
}

export function createExcerpt(text, maxLength = 160) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return normalized.slice(0, maxLength);
}

export function resolveSitePath(publicDir, absolutePath) {
  const relative = path.relative(publicDir, absolutePath);
  return `/${relative.split(path.sep).join('/')}`;
}

export async function copyWithCollision(srcPath, destDir) {
  const source = path.resolve(srcPath);
  if (!fs.existsSync(source)) {
    throw new Error(`Source file not found: ${srcPath}`);
  }

  ensureDir(destDir);
  const originalName = path.basename(source);
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);

  let candidate = path.join(destDir, originalName);
  while (fs.existsSync(candidate)) {
    const suffix = randomHex(2);
    candidate = path.join(destDir, `${base}-${suffix}${ext}`);
  }

  await fsp.copyFile(source, candidate);
  return candidate;
}

export function toNumber(value, label) {
  if (value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number for ${label}: ${value}`);
  }
  return parsed;
}
