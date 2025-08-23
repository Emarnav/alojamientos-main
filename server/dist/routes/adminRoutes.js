"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../controllers/adminControllers");
const testAuthMiddleware_1 = require("../middleware/testAuthMiddleware");
const router = express_1.default.Router();
router.get("/alojamientos", (0, testAuthMiddleware_1.testAuthMiddleware)(["admin"]), adminControllers_1.getAlojamientosPendientes);
router.get("/:cognitoId", adminControllers_1.getAdmin);
router.put("/alojamientos/:id/aprobar", (0, testAuthMiddleware_1.testAuthMiddleware)(["admin"]), adminControllers_1.aprobarAlojamiento);
router.put("/alojamientos/:id/rechazar", (0, testAuthMiddleware_1.testAuthMiddleware)(["admin"]), adminControllers_1.rechazarAlojamiento);
exports.default = router;
