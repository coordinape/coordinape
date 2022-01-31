import fetch from 'node-fetch';

// This injects fetch into the global context for node.
if (!globalThis.fetch) {
  globalThis.fetch = fetch as unknown as typeof globalThis.fetch;
}

export { fetch };
