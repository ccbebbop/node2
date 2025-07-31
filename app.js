const express = require('express');
const path = require('path');
const app = express();

// Directorio de archivos estáticos
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, {
  // Opcionales: cacheo de 1 día para archivos estáticos
  maxAge: '1d',
  etag: true,
  lastModified: true,
}));

// Fallback para SPA (si lo necesitas)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(publicDir, 'index.html'));
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor estático sirviendo ${publicDir} en http://localhost:${PORT}`);
});
