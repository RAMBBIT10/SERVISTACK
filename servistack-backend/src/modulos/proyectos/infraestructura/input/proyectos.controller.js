const servicio = require("../../servicios/proyectos.service");

async function crear(req, res) {
  res.status(201).json(await servicio.crearProyecto(req.body));
}

async function listar(req, res) {
  res.json(await servicio.listarProyectos(req.query.estado));
}

module.exports = { crear, listar };
