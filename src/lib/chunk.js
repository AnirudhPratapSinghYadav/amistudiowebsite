// After a deploy, an open tab can ask for page files that no longer exist. That shows up as a
// failed dynamic import. ErrorBoundary reloads once (flag below); a successful load clears it.
export const RELOAD_KEY = 'oneness-chunk-reload';

export const isChunkError = (e) =>
  /dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i.test(String(e?.message || e));
