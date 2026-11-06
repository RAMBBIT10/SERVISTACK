const { Router } = require("express");
const controlador = require("./notificaciones.controller");
const { verificarToken } = require("../../../../transversal/auth");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.get("/", verificarToken, manejar(controlador.listar));
router.patch("/:id/leida", verificarToken, manejar(controlador.marcarLeida));

module.exports = router;
