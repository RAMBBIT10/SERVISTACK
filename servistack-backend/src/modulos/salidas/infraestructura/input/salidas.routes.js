const { Router } = require("express");
const controlador = require("./salidas.controller");
const { verificarToken } = require("../../../../transversal/auth");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.post("/", verificarToken, manejar(controlador.registrar));
router.get("/proyecto/:proyectoId/materiales", verificarToken, manejar(controlador.materialesDeProyecto));

module.exports = router;
