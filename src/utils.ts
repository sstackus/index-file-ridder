import {
  dirname,
  extname,
  sep,
} from 'https://deno.land/std@0.177.0/path/mod.ts';
import { exists, expandGlob } from 'https://deno.land/std@0.84.0/fs/mod.ts';
import { out } from './out.ts';

const DEFAULT_EXTENSIONS = 'ts,tsx,js,jsx,mjs,cjs';

export function logError(
  path: string,
  error: Error,
  errors: Map<string, string>,
) {
  errors.set(path, error.message);
  out.log(`- ${path}`);
  out.error(`  ${error.message}`);
}

export async function rewriteFile(path: string) {
  const destination = `${dirname(path)}${extname(path)}`;
  const fileContents = await Deno.readTextFile(path);
  const newFileContents = replaceRelativeImports(fileContents);
  await Deno.writeTextFile(destination, newFileContents);
  await Deno.remove(path);
}

export function replaceRelativeImports(fileContents: string) {
  return fileContents
    .replace(/(['"`])\.{2}\/([^(\.{2})])/g, '$1./$2')
    .replace(/(['"`])\.{2}\//g, '$1');
}

export async function removeDir(path: string) {
  await Deno.remove(dirname(path), { recursive: false });
}

export function isEligibleDir(path: string) {
  const segments = path.split(sep);
  return segments.length > 2;
}

export async function isLoneFile(path: string) {
  const files = await Deno.readDir(dirname(path));
  const { length } = await Array.fromAsync(files);

  return length === 1;
}

export async function getPaths() {
  const ext = DEFAULT_EXTENSIONS;
  const basePath = Deno.args[0];

  if (!basePath) {
    throw new Error('Expected a path as CLI argument');
  }

  if (!await exists(basePath)) {
    throw new Error(
      `The path "${basePath}" does not exist or is not accessible`,
    );
  }

  const glob = `${basePath}/**/index.{${ext}}`;

  return expandGlob(glob);
}

export function ensureExtensions(str: string) {
  if (!/^[a-z\.]+(,[a-z\.]+)*$/i.test(str)) {
    throw new TypeError(
      'Extensions should be a comma-separated list, e.g.: ts,tsx,spec.js',
    );
  }
}
