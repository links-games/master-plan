// Dependency-free static server for browser checks in the pinned Node container.
// Usage: PORT=4173 node experiments/serve-master-plan.mjs _site
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { URL } from 'node:url';

const root = resolve(process.argv[2] || '_site');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};
createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const path = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname
    );
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      throw new Error('Outside website root');
    }
    if ((await stat(file)).isDirectory()) {
      file = join(file, 'index.html');
    }
    const info = await stat(file);
    if (!info.isFile()) {
      throw new Error('Not a file');
    }
    response.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Content-Length': info.size,
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') {
      response.end();
    } else {
      createReadStream(file)
        .on('error', () => response.destroy())
        .pipe(response);
    }
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
  console.log(`Serving ${root} on port ${process.env.PORT || 4173}`);
});
