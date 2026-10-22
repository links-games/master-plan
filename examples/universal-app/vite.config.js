import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function resolveBasePath() {
  if (process.env.GITHUB_PAGES !== 'true') {
    return './';
  }

  // Set when the app is published below the Pages root, e.g. /repo/example-app/.
  if (process.env.PAGES_BASE_PATH) {
    return process.env.PAGES_BASE_PATH;
  }

  const repository = process.env.GITHUB_REPOSITORY?.split('/').at(-1);
  return repository ? `/${repository}/` : './';
}

export default defineConfig({
  base: resolveBasePath(),
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: ['../..'],
    },
  },
});
