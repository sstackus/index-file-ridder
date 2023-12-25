import { glob } from 'npm:glob';
import { out } from './out.ts';
import {
  logError,
  moveFileUp,
  removeDir,
  rewriteRelativeImports,
  verifyIsEligibleDir,
  verifyIsLoneFile,
} from './utils.ts';

const TIME_LOG_KEY = 'Processing time';

export default async function main() {
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
