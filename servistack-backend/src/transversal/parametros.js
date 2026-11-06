const db = require("./db");
const cache = require("./cache");
const { configuracion } = require("./configuracion");

const PREFIJO = "parametro:";

async function obtener(clave, porDefecto) {
  const enCache = await cache.obtenerDeCache(PREFIJO + clave);
  if (enCache !== null) return enCache.valor;

  const resultado = await db.consultar("SELECT valor FROM parametro WHERE clave = $1", [clave]);
  const valor = resultado.rows.length ? resultado.rows[0].valor : porDefecto;
  await cache.guardarEnCache(PREFIJO + clave, { valor }, configuracion.parametros.segundosCache);
  return valor;
}

async function obtenerNumero(clave, porDefecto) {
  const valor = await obtener(clave, String(porDefecto));
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : porDefecto;
}

module.exports = { obtener, obtenerNumero };
