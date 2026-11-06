const { Router } = require("express");
const controlador = require("./proyectos.controller");
const { verificarToken } = require("../../../../transversal/auth");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.post("/", verificarToken, manejar(controlador.crear));
router.get("/", verificarToken, manejar(controlador.listar));

module.exports = router;
