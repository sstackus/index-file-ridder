import { out } from './out.ts';
import {
  getPaths,
  isEligibleDir,
  isLoneFile,
  logError,
  removeDir,
  rewriteFile,
} from './utils.ts';

const TIME_LOG_KEY = 'Processing time';
const DEBUG = Deno.args.includes('--debug');

export default async function main() {
  console.time(TIME_LOG_KEY);

  const paths = await getPaths();
  let pathsCount = 0;
  const successPaths = new Set();
  const skippedPaths = new Set();
  const errors = new Map();

  for await (const { path, isFile } of paths) {
    pathsCount++;
    out.log(`- ${path}`);

    try {
      if (!isFile || !isEligibleDir(path) || !(await isLoneFile(path))) {
        skippedPaths.add(path);
        continue;
      }

      await rewriteFile(path);
      await removeDir(path);

      successPaths.add(path);
    } catch (error) {
      logError(path, error, errors);
    }

    if (DEBUG) {
      // Test on a single result only
      break;
    }
  }

  out.log('—'.repeat(40));
  console.timeEnd(TIME_LOG_KEY);
  out.log(`Total files found: ${pathsCount}`);
  out.log(`Skipped files: ${skippedPaths.size}`);
  out.success(`Total files affected: ${successPaths.size}`);
  if (errors.size > 0) {
    out.error(`Encountered errors: ${errors.size}`);
  }
}
