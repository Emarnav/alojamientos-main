"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPropertyImages = exports.createProperty = exports.getProperty = exports.getProperties = exports.deleteProperty = exports.updateProperty = void 0;
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const multerConfig_1 = require("../multerConfig");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const updateProperty = (req, res) => {
    const alojamientoId = Number(req.params.id);
    const upload = (0, multerConfig_1.getMulterForAlojamiento)(alojamientoId).array("photos");
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (err) {
            return res.status(500).json({ message: "Error al subir imágenes", error: err.message });
        }
        try {
            const files = req.files;
            const _c = req.body, { direccion, ciudad, provincia, pais, codigoPostal, managerUsuarioId, estado, alojamientoId: _omitAlojamientoId, motivoRechazo, existingPhotos } = _c, propertyData = __rest(_c, ["direccion", "ciudad", "provincia", "pais", "codigoPostal", "managerUsuarioId", "estado", "alojamientoId", "motivoRechazo", "existingPhotos"]);
            const property = yield prisma.alojamiento.findUnique({
                where: { id: alojamientoId },
                include: { ubicacion: true, propietario: true },
            });
            if (!property) {
                return res.status(404).json({ message: "Alojamiento no encontrado" });
            }
            // 1. Convertir fotos existentes (del frontend)
            const existing = JSON.parse((_a = req.body.existingPhotos) !== null && _a !== void 0 ? _a : "[]");
            // 2. Fotos nuevas subidas ahora
            const newPhotos = (_b = files === null || files === void 0 ? void 0 : files.map(file => `/alojamientos/${alojamientoId}/${file.filename}`)) !== null && _b !== void 0 ? _b : [];
            // 3. Combinar todo
            const photoUrls = [...existing, ...newPhotos];
            // 4. Actualizar ubicación
            const geo = yield axios_1.default.get("https://nominatim.openstreetmap.org/search?" + new URLSearchParams({
                street: direccion,
                city: ciudad,
                country: "España",
                postalcode: codigoPostal,
                format: "json",
                limit: "1",
            }).toString(), {
                headers: { "User-Agent": "UCHCEU (desarrolloweb@uchceu.es)" }
            });
            const [lon, lat] = geo.data[0] ? [parseFloat(geo.data[0].lon), parseFloat(geo.data[0].lat)] : [0, 0];
            yield prisma.ubicacion.update({
                where: { id: property.ubicacionId },
                data: {
                    direccion,
                    ciudad,
                    provincia,
                    pais: 'España',
                    codigoPostal,
                    latitud: lat,
                    longitud: lon,
                },
            });
            // 5. Actualizar propiedad
            const updatedProperty = yield prisma.alojamiento.update({
                where: { id: alojamientoId },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, propertyData), { photoUrls, managerUsuarioId: Number(managerUsuarioId), esDestacado: typeof propertyData.esDestacado !== "undefined"
                        ? propertyData.esDestacado === "true"
                        : property.esDestacado, hayTelevision: propertyData.hayTelevision === "true", hayTelefono: propertyData.hayTelefono === "true", hayInternet: propertyData.hayInternet === "true", hayTerraza: propertyData.hayTerraza === "true", hayAscensor: propertyData.hayAscensor === "true", hayGaraje: propertyData.hayGaraje === "true", hayLavavajillas: propertyData.hayLavavajillas === "true", hayHorno: propertyData.hayHorno === "true", hayMicroondas: propertyData.hayMicroondas === "true", hayNevera: propertyData.hayNevera === "true", hayLavadora: propertyData.hayLavadora === "true", haySecadora: propertyData.haySecadora === "true", hayPortero: propertyData.hayPortero === "true", hayMuebles: propertyData.hayMuebles === "true", hayCalefaccion: propertyData.hayCalefaccion === "true", hayAireAcondicionado: propertyData.hayAireAcondicionado === "true", hayGas: propertyData.hayGas === "true", hayPiscina: propertyData.hayPiscina === "true", hayZonaComunitaria: propertyData.hayZonaComunitaria === "true", hayGimnasio: propertyData.hayGimnasio === "true", aguaIncluido: propertyData.aguaIncluido === "true", gasIncluido: propertyData.gasIncluido === "true", electricidadIncluido: propertyData.electricidadIncluido === "true", internetIncluido: propertyData.internetIncluido === "true", precio: parseFloat(propertyData.precio), habitaciones: parseInt(propertyData.habitaciones), banos: parseFloat(propertyData.banos), plazasLibres: parseInt(propertyData.plazasLibres), superficie: parseInt(propertyData.superficie), descripcion: propertyData.descripcion, tipoAlojamiento: propertyData.tipoAlojamiento, dirigidoA: propertyData.dirigidoA, infoExtra: propertyData.infoExtra }), (estado && { estado })), (motivoRechazo && { motivoRechazo })),
                include: { ubicacion: true, propietario: true },
            });
            // 6. Borrar imágenes eliminadas por el usuario
            const alojamientoPath = path_1.default.join(process.cwd(), "public", "alojamientos", String(alojamientoId));
            if (fs_1.default.existsSync(alojamientoPath)) {
                const allFiles = fs_1.default.readdirSync(alojamientoPath);
                const filesToKeep = photoUrls.map((p) => path_1.default.basename(p));
                for (const file of allFiles) {
                    if (!filesToKeep.includes(file)) {
                        fs_1.default.unlinkSync(path_1.default.join(alojamientoPath, file));
                    }
                }
            }
            res.json(updatedProperty);
        }
        catch (err) {
            res.status(500).json({ message: `Error al actualizar la propiedad: ${err.message}` });
        }
    }));
};
exports.updateProperty = updateProperty;
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const alojamientoId = Number(req.params.id);
    if (isNaN(alojamientoId)) {
        res.status(400).json({ message: "ID inválido" }); // ✅ sin `return`
        return;
    }
    try {
        // 1. Eliminar carpeta de imágenes si existe
        const alojamientoPath = path_1.default.join(process.cwd(), "public", "alojamientos", String(alojamientoId));
        if (fs_1.default.existsSync(alojamientoPath)) {
            fs_1.default.rmSync(alojamientoPath, { recursive: true, force: true });
        }
        // 2. Eliminar alojamiento de la BBDD
        yield prisma.alojamiento.delete({
            where: { id: alojamientoId },
        });
        res.status(200).json({ message: "Alojamiento eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar alojamiento:", error);
        res.status(500).json({ message: "Error al eliminar el alojamiento", error: error.message });
    }
});
exports.deleteProperty = deleteProperty;
const getProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { priceMin, priceMax, beds, baths, propertyType, squareFeetMin, squareFeetMax, latitude, longitude, } = req.query;
        const filters = {};
        if (priceMin)
            filters.precio = { gte: Number(priceMin) };
        if (priceMax)
            filters.precio = Object.assign(Object.assign({}, filters.precio), { lte: Number(priceMax) });
        if (beds && beds !== "any")
            filters.habitaciones = { gte: Number(beds) };
        if (baths && baths !== "any")
            filters.banos = { gte: Number(baths) };
        if (squareFeetMin)
            filters.superficie = { gte: Number(squareFeetMin) };
        if (squareFeetMax)
            filters.superficie = Object.assign(Object.assign({}, filters.superficie), { lte: Number(squareFeetMax) });
        if (propertyType && propertyType !== "any")
            filters.tipoAlojamiento = propertyType;
        const alojamientos = yield prisma.alojamiento.findMany({
            where: filters,
            include: {
                ubicacion: true,
                propietario: true,
            },
        });
        const withCoords = alojamientos
            .map((a) => {
            if (latitude && longitude) {
                const lat = parseFloat(latitude);
                const lng = parseFloat(longitude);
                const delta = 0.1; // ~11 km
                const dentro = Math.abs(a.ubicacion.latitud - lat) <= delta &&
                    Math.abs(a.ubicacion.longitud - lng) <= delta;
                if (!dentro)
                    return null;
            }
            const _a = a.ubicacion, { latitud, longitud } = _a, rest = __rest(_a, ["latitud", "longitud"]);
            return Object.assign(Object.assign({}, a), { ubicacion: Object.assign(Object.assign({}, rest), { coordinates: {
                        latitude: latitud,
                        longitude: longitud,
                    } }) });
        })
            .filter(Boolean);
        res.json(withCoords);
    }
    catch (error) {
        res.status(500).json({
            message: `Error al recuperar los alojamientos: ${error.message}`,
        });
    }
});
exports.getProperties = getProperties;
const getProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const property = yield prisma.alojamiento.findUnique({
            where: { id: Number(id) },
            include: {
                ubicacion: true,
                propietario: true,
            },
        });
        if (!property) {
            res.status(404).json({ message: "Alojamiento no encontrado" });
            return;
        }
        const _a = property.ubicacion, { latitud, longitud } = _a, restUbicacion = __rest(_a, ["latitud", "longitud"]);
        const propertyWithCoordinates = Object.assign(Object.assign({}, property), { ubicacion: Object.assign(Object.assign({}, restUbicacion), { latitud,
                longitud }) });
        res.json(propertyWithCoordinates);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: `Error al recuperar el alojamiento: ${err.message}` });
    }
});
exports.getProperty = getProperty;
const createProperty = (req, res) => {
    const upload = (0, multerConfig_1.getMulterForAlojamiento)("temp").array("photos");
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (err) {
            return res.status(500).json({ message: "Error al subir imágenes", error: err.message });
        }
        const files = req.files;
        const tempDir = (_b = (_a = files[0]) === null || _a === void 0 ? void 0 : _a.destination) !== null && _b !== void 0 ? _b : "";
        try {
            const _c = req.body, { direccion, ciudad, provincia, codigoPostal, managerUsuarioId } = _c, propertyData = __rest(_c, ["direccion", "ciudad", "provincia", "codigoPostal", "managerUsuarioId"]);
            const geo = yield axios_1.default.get("https://nominatim.openstreetmap.org/search?" + new URLSearchParams({
                street: direccion,
                city: ciudad,
                country: "España",
                postalcode: codigoPostal,
                format: "json",
                limit: "1",
            }).toString(), { headers: { "User-Agent": "UCHCEU (desarrolloweb@uchceu.es)" } });
            const [lon, lat] = geo.data[0] ? [parseFloat(geo.data[0].lon), parseFloat(geo.data[0].lat)] : [0, 0];
            const ubicacion = yield prisma.ubicacion.create({
                data: {
                    direccion,
                    ciudad,
                    provincia,
                    pais: "España",
                    codigoPostal,
                    latitud: lat,
                    longitud: lon,
                },
            });
            const alojamiento = yield prisma.alojamiento.create({
                data: Object.assign(Object.assign({}, mapPropertyBooleans(propertyData)), { precio: Number(propertyData.precio), habitaciones: Number(propertyData.habitaciones), banos: Number(propertyData.banos), plazasLibres: Number(propertyData.plazasLibres), superficie: Number(propertyData.superficie), tipoAlojamiento: propertyData.tipoAlojamiento, infoExtra: propertyData.infoExtra, estado: "Pendiente", propietario: {
                        connect: { id: parseInt(managerUsuarioId) },
                    }, ubicacion: {
                        connect: { id: ubicacion.id },
                    }, photoUrls: [] }),
            });
            // ➜ mover archivos de temp a carpeta final con ID real
            const finalDir = path_1.default.join(process.cwd(), "public", "alojamientos", String(alojamiento.id));
            fs_1.default.mkdirSync(finalDir, { recursive: true });
            const photoUrls = files.map((file) => {
                const filename = path_1.default.basename(file.filename);
                const newPath = path_1.default.join(finalDir, filename);
                fs_1.default.renameSync(path_1.default.join(tempDir, filename), newPath);
                return `/alojamientos/${alojamiento.id}/${filename}`;
            });
            const updated = yield prisma.alojamiento.update({
                where: { id: alojamiento.id },
                data: { photoUrls },
                include: { propietario: true, ubicacion: true },
            });
            // Limpieza carpeta temporal
            fs_1.default.rmdirSync(tempDir, { recursive: true });
            res.status(201).json(updated);
        }
        catch (err) {
            res.status(500).json({ message: `Error al crear la propiedad: ${err.message}` });
        }
    }));
};
exports.createProperty = createProperty;
const uploadPropertyImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const alojamientoId = Number(req.params.id);
    if (isNaN(alojamientoId)) {
        return res.status(400).json({ message: "ID de alojamiento inválido" });
    }
    const upload = (0, multerConfig_1.getMulterForAlojamiento)(alojamientoId).array("photos");
    upload(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(500).json({ message: "Error al subir imágenes", error: err.message });
        }
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No se han subido imágenes" });
        }
        const photoUrls = files.map((file) => `/alojamientos/${alojamientoId}/${file.filename}`);
        try {
            const updated = yield prisma.alojamiento.update({
                where: { id: alojamientoId },
                data: { photoUrls },
            });
            return res.status(200).json({ message: "Imágenes actualizadas", photoUrls });
        }
        catch (error) {
            return res.status(500).json({ message: "Error al actualizar las URLs de imágenes", error: error.message });
        }
    }));
});
exports.uploadPropertyImages = uploadPropertyImages;
// Mapeo de booleanos
function mapPropertyBooleans(data) {
    const booleanFields = [
        "esDestacado", "hayTelevision", "hayTelefono", "hayInternet", "hayTerraza", "hayAscensor", "hayGaraje",
        "hayLavavajillas", "hayHorno", "hayMicroondas", "hayNevera", "hayLavadora", "haySecadora",
        "hayPortero", "hayMuebles", "hayCalefaccion", "hayAireAcondicionado", "hayGas", "hayPiscina",
        "hayZonaComunitaria", "hayGimnasio", "aguaIncluido", "gasIncluido", "internetIncluido", "electricidadIncluido"
    ];
    const result = Object.assign({}, data);
    for (const field of booleanFields) {
        if (field in result) {
            result[field] = result[field] === "true";
        }
    }
    return result;
}
