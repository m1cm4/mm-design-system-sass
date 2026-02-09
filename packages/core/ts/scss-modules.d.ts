// =============================================================================
// SCSS Module declaration for TypeScript
// =============================================================================
// Allows TypeScript to understand `import tokens from './file.module.scss'`.
// Copy this file to your project's `src/` or reference it in tsconfig.json.
//
// Usage in tsconfig.json:
//   "include": ["node_modules/@mm-ds/core/ts/scss-modules.d.ts", "src"]
// =============================================================================

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
