# index-ridder

:warning: Work in progress.

A deno-based utility that solves having hordes of `index.(ts|js)` files in a project.

Turns this:
```
src/aaa/index.ts
src/bbb/index.tsx
src/ccc/index.mjs
```

Into this:
```
src/aaa.ts
src/bbb.tsx
src/ccc.mjs
```
