const { ErrorNegocio } = require("./errores");
const { configuracion } = require("./configuracion");

const ZONA_VISUAL = configuracion.fechas.zonaVisual;
const ISO_CON_ZONA = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/;

function ahoraUTC() {
  return new Date();
}

function aISO(fecha) {
  return new Date(fecha).toISOString();
}

function parsearISO(texto) {
  if (typeof texto !== "string" || !ISO_CON_ZONA.test(texto)) {
    throw new ErrorNegocio("FECHA_FORMATO_INVALIDO", 400);
  }
  const fecha = new Date(texto);
  if (Number.isNaN(fecha.getTime())) {
    throw new ErrorNegocio("FECHA_FORMATO_INVALIDO", 400);
  }
  return fecha;
}

function aHoraLocal(fecha, zona = ZONA_VISUAL) {
  return new Intl.DateTimeFormat(configuracion.fechas.locale, {
    timeZone: zona,
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(fecha));
}

module.exports = { ahoraUTC, aISO, parsearISO, aHoraLocal, ZONA_VISUAL };
