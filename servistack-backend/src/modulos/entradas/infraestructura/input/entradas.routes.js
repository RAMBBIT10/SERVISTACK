const { Router } = require("express");
const controlador = require("./entradas.controller");
const { verificarToken } = require("../../../../transversal/auth");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.post("/", verificarToken, manejar(controlador.registrar));

module.exports = router;
