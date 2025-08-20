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
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const allowedOrigins = [
  "https://alojamientos-lemon.vercel.app/",
  process.env.FRONTEND_URL || "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* Hacer accesibles las imágenes en /alojamientos */
app.use(express.static(path.join(__dirname, "../public")));

/* Rutas */
app.use("/api/alojamientos", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/estudiante", tenantRoutes);
app.use("/api/propietario", managerRoutes);
app.use("/api/chat", authMiddleware(["estudiante", "propietario"]), chatRoutes);


/* SERVER */
const port = Number(process.env.PORT) || 3002;
app.get("/", (_req, res) => {
  res.send("API corriendo correctamente");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
