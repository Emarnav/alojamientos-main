"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const managerControllers_1 = require("../controllers/managerControllers");
const testAuthMiddleware_1 = require("../middleware/testAuthMiddleware");
const router = express_1.default.Router();
// Rutas protegidas
router.get("/:cognitoId", (0, testAuthMiddleware_1.testAuthMiddleware)(["propietario"]), managerControllers_1.getManager);
router.put("/:cognitoId", (0, testAuthMiddleware_1.testAuthMiddleware)(["propietario"]), managerControllers_1.updateManager);
router.get("/:cognitoId/alojamientos", (0, testAuthMiddleware_1.testAuthMiddleware)(["propietario"]), managerControllers_1.getManagerProperties);
// Ruta abierta para registro (sin necesidad de que exista en la BD todavía)
router.post("/", testAuthMiddleware_1.testExtractUserFromToken, managerControllers_1.createManager);
exports.default = router;
