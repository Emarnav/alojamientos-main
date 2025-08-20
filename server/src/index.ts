import * as path from "path";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/authMiddleware";

/* ROUTE IMPORT */
import tenantRoutes from "./routes/tenantRoutes";
import managerRoutes from "./routes/managerRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import chatRoutes from "./routes/chatRoutes";
import adminRoutes from "./routes/adminRoutes";

/* CONFIGURATIONS */
dotenv.config();

// Crear router en lugar de app
const apiRouter = express.Router();

// Middleware para el router
apiRouter.use(helmet());
apiRouter.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
apiRouter.use(morgan("common"));
apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({ extended: false }));

const allowedOrigins = [
  "https://alojamientos-lemon.vercel.app/",
  process.env.FRONTEND_URL || "http://localhost:3000"
];

apiRouter.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* Hacer accesibles las imágenes en /alojamientos */
apiRouter.use(express.static(path.join(__dirname, "../public")));

/* Rutas */
apiRouter.use("/alojamientos", propertyRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/estudiante", tenantRoutes);
apiRouter.use("/propietario", managerRoutes);
apiRouter.use("/chat", authMiddleware(["estudiante", "propietario"]), chatRoutes);

// Ruta de salud
apiRouter.get("/", (_req, res) => {
  res.send("API corriendo correctamente");
});

// Exportar el router solo como CommonJS
module.exports = apiRouter;
