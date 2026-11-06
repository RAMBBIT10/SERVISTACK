const { Router } = require("express");
const controlador = require("./productos.controller");
const { verificarToken } = require("../../../../transversal/auth");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.post("/", verificarToken, manejar(controlador.crear));
router.get("/", verificarToken, manejar(controlador.listar));
router.get("/stock-bajo", verificarToken, manejar(controlador.listarStockBajo));
router.get("/:id", verificarToken, manejar(controlador.consultarPorId));
router.get("/:id/enlace-corto", verificarToken, manejar(controlador.crearEnlaceCorto));
router.post("/:id/foto/url-subida", verificarToken, manejar(controlador.pedirUrlDeFoto));
router.put("/:id/foto", verificarToken, manejar(controlador.confirmarFoto));
router.get("/:id/qr", verificarToken, manejar(controlador.descargarQr));

module.exports = router;
