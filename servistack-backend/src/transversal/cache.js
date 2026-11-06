const Redis = require("ioredis");
const { configuracion } = require("./configuracion");
const logger = require("./logger");

const redis = new Redis(configuracion.cache.url, {
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
});

redis.on("error", (error) => logger.warn({ err: error }, "Redis no disponible"));

async function obtenerDeCache(clave) {
  try {
    const valor = await redis.get(clave);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    logger.warn({ err: error }, "No se pudo leer la cache");
    return null;
  }
}

async function guardarEnCache(clave, valor, segundos = configuracion.cache.segundosVida) {
  try {
    await redis.set(clave, JSON.stringify(valor), "EX", segundos);
  } catch (error) {
    logger.warn({ err: error }, "No se pudo guardar en la cache");
  }
}

async function invalidarCache(...claves) {
  try {
    if (claves.length) await redis.del(...claves);
  } catch (error) {
    logger.warn({ err: error }, "No se pudo invalidar la cache");
  }
}

function cerrarCache() {
  redis.disconnect();
}

module.exports = { obtenerDeCache, guardarEnCache, invalidarCache, cerrarCache };
