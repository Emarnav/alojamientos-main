"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tenantControllers_1 = require("../controllers/tenantControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// 🔓 Ruta abierta para registro (aún no existe en BD)
router.post("/", authMiddleware_1.extractUserFromToken, tenantControllers_1.createTenant);
// 🔐 Rutas protegidas: solo tipo 'estudiante'
router.get("/:cognitoId", (0, authMiddleware_1.authMiddleware)(["estudiante"]), tenantControllers_1.getTenant);
router.put("/:cognitoId", (0, authMiddleware_1.authMiddleware)(["estudiante"]), tenantControllers_1.updateStudent);
router.get("/:cognitoId/current-residences", (0, authMiddleware_1.authMiddleware)(["estudiante"]), tenantControllers_1.getCurrentResidences);
router.post("/:cognitoId/favoritos/:propertyId", (0, authMiddleware_1.authMiddleware)(["estudiante"]), tenantControllers_1.addFavoriteProperty);
router.delete("/:cognitoId/favoritos/:propertyId", (0, authMiddleware_1.authMiddleware)(["estudiante"]), tenantControllers_1.removeFavoriteProperty);
exports.default = router;
