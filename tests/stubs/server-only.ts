// Vitest stub for the `server-only` package.
// Next.js's bundler aliases `server-only` to a no-op when compiling server code and only lets
// the real (throwing) module reach a Client Component bundle. Plain vitest has no such bundler
// distinction, so this alias (see vitest.config.ts) keeps server-only modules unit-testable
// without weakening the real client/server boundary Next.js enforces at build time.
export {};
