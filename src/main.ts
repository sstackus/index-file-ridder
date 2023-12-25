import { readdir, rename, rmdir } from 'node:fs/promises';
import { dirname, extname, sep } from 'node:path';
import { glob } from 'glob';

const TIME_LOG_KEY = 'Processing time';

const Ansi = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  LIGHTGRAY: '\x1b[90m',
  BOLD: '\x1b[1m',
};

const out = {
  success(message: string) {
    return console.log(`${Ansi.BOLD}${Ansi.GREEN}${message}${Ansi.RESET}`);
  },
  error(message: string) {
    return console.log(`${Ansi.BOLD}${Ansi.RED}${message}${Ansi.RESET}`);
  },
  log(message: string) {
    return console.log(`${Ansi.LIGHTGRAY}${message}${Ansi.RESET}`);
  },
};

async function main() {
  console.time(TIME_LOG_KEY);

  const paths = await glob('src/**/index.{ts,tsx,js,jsx}');

  const files = new Set();
  const errors = new Map();

  for (const path of paths) {
    try {
      verifyIsEligibleDir(path);
      await verifyIsLoneFile(path);
      await moveFileUp(path);
      await rewriteRelativeImports(path);
      await removeDir(path);
      files.add(path);
    } catch (error) {
      logError(path, error, errors);
    }
  }

  out.log('—'.repeat(40));
  console.timeEnd(TIME_LOG_KEY);

  out.log(`Total files found: ${paths.length}`);
  out.success(`Total files moved: ${files.size}`);

  if (errors.size > 0) {
    out.error(`Encountered errors: ${errors.size}`);
  }
}

function logError(path, error, errors) {
  errors.set(path, error.message);
  out.log(`- ${path}`);
  out.error(`  ${error.message}`);
}

async function moveFileUp(path) {
  const destination = `${dirname(path)}${extname(path)}`;
  await rename(path, destination);
}

async function rewriteRelativeImports(path) {
  const destination = `${dirname(path)}${extname(path)}`;
  await rename(path, destination);
}

async function removeDir(path) {
  await rmdir(dirname(path));
}

function verifyIsEligibleDir(path) {
  const segments = path.split(sep);
  if (segments.length < 3) {
    throw new Error('Path segment length');
  }
}

async function verifyIsLoneFile(path) {
  const files = await readdir(dirname(path));
  if (files.length !== 1) {
    throw new Error('Other files present in directory');
  }
}

export default main();
