import { readdir, rename, rmdir } from 'node:fs/promises';
import { dirname, extname, sep } from 'node:path';
import { out } from './out.ts';

export function logError(
  path: string,
  error: Error,
  errors: Map<string, string>,
) {
  errors.set(path, error.message);
  out.log(`- ${path}`);
  out.error(`  ${error.message}`);
}

export async function moveFileUp(path: string) {
  const destination = `${dirname(path)}${extname(path)}`;
  await rename(path, destination);
}

export async function rewriteRelativeImports(path: string) {
  const destination = `${dirname(path)}${extname(path)}`;
  await rename(path, destination);
}

export async function removeDir(path: string) {
  await rmdir(dirname(path));
}

export function verifyIsEligibleDir(path: string) {
  const segments = path.split(sep);
  if (segments.length < 3) {
    throw new Error('Path segment length');
  }
}

export async function verifyIsLoneFile(path: string) {
  const files = await readdir(dirname(path));
  if (files.length !== 1) {
    throw new Error('Other files present in directory');
  }
}
