const servicio = require("../../servicios/entradas.service");

async function registrar(req, res) {
  res.status(201).json(await servicio.registrarEntrada(req.body));
}

module.exports = { registrar };
