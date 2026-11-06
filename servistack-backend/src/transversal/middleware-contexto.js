const crypto = require("node:crypto");
const { trace } = require("@opentelemetry/api");
const { ejecutarConContexto, agregarAlContexto } = require("./contexto");
const logger = require("./logger");

function middlewareContexto(req, res, next) {
  const idPeticion = req.headers["x-request-id"] || crypto.randomUUID();
  res.setHeader("x-request-id", idPeticion);

  ejecutarConContexto({ id_peticion: idPeticion, metodo: req.method, ruta: req.path }, () => {
    const span = trace.getActiveSpan();
    if (span) span.setAttribute("servistack.id_peticion", idPeticion);

    const inicio = process.hrtime.bigint();
    res.on("finish", () => {
      const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
      logger.info({ estado: res.statusCode, duracion_ms: Math.round(ms) }, "peticion terminada");
    });
    next();
  });
}

function middlewareUsuario(req, res, next) {
  const sub = req.auth && req.auth.payload && req.auth.payload.sub;
  if (sub) {
    agregarAlContexto("usuario_id", sub);
    const span = trace.getActiveSpan();
    if (span) span.setAttribute("enduser.id", sub);
  }
  next();
}

module.exports = { middlewareContexto, middlewareUsuario };
