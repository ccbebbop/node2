const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.txt':  'text/plain',
  '.ico':  'image/x-icon',
};

const publicDir = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  // Normalizar ruta y evitar traversal
  let safePath = path.normalize(decodeURI(req.url)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') safePath = '/index.html';
  const filePath = path.join(publicDir, safePath);

  // Verificar que esté dentro de public
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end('Acceso prohibido');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end('No encontrado');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mime[ext] || 'application/octet-stream';

    // Headers básicos y cacheo (1 día)
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
      'Last-Modified': stats.mtime.toUTCString(),
      'ETag': `${stats.size}-${Date.parse(stats.mtime)}`,
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on('error', () => {
      res.writeHead(500);
      res.end('Error en el servidor');
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor estático en http://localhost:${PORT}, sirviendo ${publicDir}`);
});