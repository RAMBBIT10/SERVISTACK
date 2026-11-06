const servicio = require("../../servicios/salidas.service");

async function registrar(req, res) {
  res.status(201).json(await servicio.registrarSalida(req.body));
}

async function materialesDeProyecto(req, res) {
  res.json(await servicio.consultarMaterialesDeProyecto(req.params.proyectoId));
}

module.exports = { registrar, materialesDeProyecto };
