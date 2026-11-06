const db = require("./db");
const logger = require("./logger");

let textos = null;

async function cargar() {
  const resultado = await db.consultar("SELECT codigo, texto FROM mensaje");
  textos = new Map(resultado.rows.map((fila) => [fila.codigo, fila.texto]));
}

async function obtener(codigo, valores = {}) {
  try {
    if (!textos || !textos.has(codigo)) await cargar();
  } catch (error) {
    logger.warn({ err: error }, "No se pudo cargar el catalogo de mensajes");
  }
  const plantilla = (textos && textos.get(codigo)) || codigo;
  return plantilla.replace(/\{(\w+)\}/g, (completo, clave) =>
    valores[clave] === undefined ? completo : valores[clave]
  );
}

function reiniciar() {
  textos = null;
}

module.exports = { obtener, reiniciar };
