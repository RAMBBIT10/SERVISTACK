const repositorio = require("../infraestructura/output/notificaciones.repository");
const push = require("../../../transversal/notificaciones-push");
const mensajes = require("../../../transversal/mensajes");
const logger = require("../../../transversal/logger");
const { configuracion } = require("../../../transversal/configuracion");
const { ErrorNegocio } = require("../../../transversal/errores");
const { NOTIFICACION } = require("../../../transversal/estados");

async function notificarStockBajo(producto) {
  const valores = { nombre: producto.nombre, stock: producto.stock_actual };
  const mensaje = await mensajes.obtener("STOCK_BAJO_NOTIFICACION", valores);

  await repositorio.crear({ tipo: NOTIFICACION.STOCK_BAJO, productoId: producto.id, mensaje });

  try {
    const titulo = await mensajes.obtener("STOCK_BAJO_PUSH_TITULO", valores);
    const cuerpo = await mensajes.obtener("STOCK_BAJO_PUSH_CUERPO", valores);
    await push.enviarAlTopico(configuracion.push.topicoStockBajo, titulo, cuerpo);
  } catch (error) {
    logger.error({ err: error }, "No se pudo enviar la alerta push");
  }
}

async function listarNotificaciones() {
  return repositorio.listar();
}

async function marcarComoLeida(id) {
  const notificacion = await repositorio.marcarLeida(id);
  if (!notificacion) throw new ErrorNegocio("NOTIFICACION_NO_ENCONTRADA", 404);
}

module.exports = { notificarStockBajo, listarNotificaciones, marcarComoLeida };
