const express = require('express');
const next = require('next');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './client' });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Si tienes rutas propias:
let apiRoutes = require('./server/dist/index.js');
apiRoutes = apiRoutes.default || apiRoutes; // si tiene .default lo usamos

server.use('/api', apiRoutes);


  // Next.js render
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
