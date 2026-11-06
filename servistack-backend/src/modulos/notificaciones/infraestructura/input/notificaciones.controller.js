const servicio = require("../../servicios/notificaciones.service");

async function listar(req, res) {
  res.json(await servicio.listarNotificaciones());
}

async function marcarLeida(req, res) {
  await servicio.marcarComoLeida(req.params.id);
  res.status(204).send();
}

module.exports = { listar, marcarLeida };
