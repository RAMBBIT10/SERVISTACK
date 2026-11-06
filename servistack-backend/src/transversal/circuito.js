const CircuitBreaker = require("opossum");
const { configuracion } = require("./configuracion");
const logger = require("./logger");

function protegido(nombre, accion) {
  const circuito = new CircuitBreaker(accion, {
    name: nombre,
    timeout: configuracion.circuito.tiempoMaximoMs,
    errorThresholdPercentage: configuracion.circuito.porcentajeError,
    resetTimeout: configuracion.circuito.reinicioMs,
  });
  circuito.on("open", () => logger.warn({ circuito: nombre }, "Circuito abierto"));
  circuito.on("halfOpen", () => logger.info({ circuito: nombre }, "Circuito semiabierto"));
  circuito.on("close", () => logger.info({ circuito: nombre }, "Circuito cerrado"));
  return circuito;
}

module.exports = { protegido };
