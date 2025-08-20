const express = require('express');
const next = require('next');
const cors = require('cors');

console.log('🚀 Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

const dev = false; // Forzar modo producción
const app = next({ dev, dir: './client' });
const handle = app.getRequestHandler();

console.log('📦 Preparing Next.js app...');

app.prepare().then(() => {
  console.log('✅ Next.js app prepared');
  const server = express();

  // Middleware global
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Configurar CORS para el servidor principal
  const allowedOrigins = [
    "https://alojamientos-lemon.vercel.app/",
    process.env.FRONTEND_URL || "http://localhost:3000"
  ];
  
  server.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

  // Ruta de health check simple
  server.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Importar y usar las rutas API
  const apiRouter = require('./server/dist/index.js');
  console.log('📡 Loading API routes...');
  
  server.use('/api', apiRouter);
  console.log('✅ API routes loaded');

  // Next.js render para todas las demás rutas
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`🌟 Server running on port ${port}`);
    console.log(`🔗 Local: http://localhost:${port}`);
    console.log(`🔗 Network: http://0.0.0.0:${port}`);
  });
}).catch(err => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});
