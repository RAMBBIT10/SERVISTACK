const { auth } = require("express-oauth2-jwt-bearer");
const { configuracion } = require("./configuracion");
const { ErrorNegocio } = require("./errores");
const { middlewareUsuario } = require("./middleware-contexto");
const { TIPO_EMPLEADO } = require("./estados");

const verificarToken = [
  auth({
    audience: configuracion.autenticacion.audience,
    issuerBaseURL: configuracion.autenticacion.emisor,
  }),
  middlewareUsuario,
];

function obtenerTipoEmpleado(req) {
  return req.auth?.payload?.[configuracion.autenticacion.claimTipoEmpleado];
}

function soloAdministrador(req, res, next) {
  if (obtenerTipoEmpleado(req) !== TIPO_EMPLEADO.ADMINISTRADOR) {
    return next(new ErrorNegocio("ADMIN_REQUERIDO", 403));
  }
  next();
}

module.exports = { verificarToken, soloAdministrador, obtenerTipoEmpleado };
