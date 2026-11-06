const servicio = require("../../servicios/pedidos.service");

async function crear(req, res) {
  res.status(201).json(await servicio.crearPedido(req.body));
}

async function consultarPorId(req, res) {
  res.json(await servicio.consultarPedido(req.params.id));
}

module.exports = { crear, consultarPorId };
