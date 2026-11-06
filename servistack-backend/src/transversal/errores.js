const mensajes = require("./mensajes");
const logger = require("./logger");

class ErrorNegocio extends Error {
  constructor(codigo, estado, valores = {}) {
    super(codigo);
    this.codigo = codigo;
    this.status = estado;
    this.valores = valores;
  }
}

async function manejadorErrores(error, req, res, next) {
  if (error instanceof ErrorNegocio) {
    const mensaje = await mensajes.obtener(error.codigo, error.valores);
    return res.status(error.status).json({ codigo: error.codigo, error: mensaje });
  }
  if (error.status && error.status < 500) {
    return res.status(error.status).json({ error: error.message });
  }
  logger.error({ err: error }, "error no controlado");
  const mensaje = await mensajes.obtener("ERROR_INTERNO");
  res.status(500).json({ codigo: "ERROR_INTERNO", error: mensaje });
}

module.exports = { ErrorNegocio, manejadorErrores };
