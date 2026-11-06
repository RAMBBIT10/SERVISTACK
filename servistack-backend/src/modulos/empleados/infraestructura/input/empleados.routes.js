const { Router } = require("express");
const controlador = require("./empleados.controller");
const { verificarToken, soloAdministrador } = require("../../../../transversal/auth");
const { manejar } = require("../../../../transversal/manejar");

const router = Router();

router.post("/", verificarToken, soloAdministrador, manejar(controlador.crear));
router.get("/", verificarToken, manejar(controlador.listar));
router.delete("/:id", verificarToken, soloAdministrador, manejar(controlador.eliminar));

module.exports = router;
