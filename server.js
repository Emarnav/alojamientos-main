const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './client' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
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

  // Importar y usar las rutas API con debugging
  const apiModule = require('./server/dist/index.js');
  console.log('API Module keys:', Object.keys(apiModule));
  console.log('API Module type:', typeof apiModule);
  console.log('API Module default:', apiModule.default);
  console.log('API Module direct:', apiModule);
  
  const apiRouter = apiModule.default || apiModule;
  console.log('Final router type:', typeof apiRouter);
  console.log('Final router keys:', Object.keys(apiRouter));
  
  server.use('/api', apiRouter);

  // Next.js render para todas las demás rutas
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
});
