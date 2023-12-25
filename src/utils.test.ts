import { assertEquals } from 'https://deno.land/std@0.210.0/assert/mod.ts';
import { replaceRelativeImports } from './utils.ts';

const relativePaths = {
  before: unindent(`import a from '../a';
    import b from '../../../b.ts';
    import c from './c';
    import f from 'ff/ff/ff';
    console.log(require('../../d/../e'));`),
  expected: unindent(`import a from './a';
    import b from '../../b.ts';
    import c from './c';
    import f from 'ff/ff/ff';
    console.log(require('../d/../e'));`),
};

Deno.test('Replace relative imports', () => {
  const replacedImports = replaceRelativeImports(relativePaths.before);

  assertEquals(replacedImports, relativePaths.expected);
});

function unindent(str: string) {
  return str.replaceAll(/\n */g, '\n');
}
