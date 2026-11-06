const { Router } = require("express");
const controlador = require("./pedidos.controller");
const { verificarToken } = require("../../../../transversal/auth");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.post("/", verificarToken, manejar(controlador.crear));
router.get("/:id", verificarToken, manejar(controlador.consultarPorId));

module.exports = router;
