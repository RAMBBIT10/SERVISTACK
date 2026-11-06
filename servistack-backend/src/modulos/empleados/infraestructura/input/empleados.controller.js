const servicio = require("../../servicios/empleados.service");

async function crear(req, res) {
  res.status(201).json(await servicio.crearEmpleado(req.body));
}

async function listar(req, res) {
  res.json(await servicio.listarEmpleados());
}

async function eliminar(req, res) {
  await servicio.eliminarEmpleado(req.params.id);
  res.status(204).send();
}

module.exports = { crear, listar, eliminar };
