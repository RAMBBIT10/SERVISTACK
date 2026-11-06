const { Router } = require("express");
const controlador = require("./productos.controller");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.get("/:codigo", manejar(controlador.redirigirEnlace));

module.exports = router;
