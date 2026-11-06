const repositorio = require("../infraestructura/output/salidas.repository");
const productosService = require("../../productos/servicios/productos.service");
const proyectosService = require("../../proyectos/servicios/proyectos.service");
const broker = require("../../../transversal/broker");
const db = require("../../../transversal/db");
const { ErrorNegocio } = require("../../../transversal/errores");
const { EVENTO } = require("../../../transversal/estados");
const { faltanCampos, esEnteroPositivo } = require("../../../transversal/validaciones");

async function registrarSalida(datos) {
  if (faltanCampos(datos, ["proyectoId", "productoId", "cantidad"]) || !esEnteroPositivo(datos.cantidad)) {
    throw new ErrorNegocio("DATOS_MOVIMIENTO_INVALIDOS", 400);
  }

  const { salida, productoActualizado } = await db.transaccion(async (cliente) => {
    await proyectosService.verificarQueExiste(datos.proyectoId, cliente);

    const producto = await productosService.bloquearProducto(datos.productoId, cliente);
    if (producto.stock_actual < datos.cantidad) {
      throw new ErrorNegocio("STOCK_INSUFICIENTE", 422, { disponible: producto.stock_actual });
    }

    const nueva = await repositorio.crear(datos, cliente);
    const actualizado = await productosService.ajustarStock(datos.productoId, -datos.cantidad, cliente);
    return { salida: nueva, productoActualizado: actualizado };
  });

  await productosService.invalidarCacheProducto(datos.productoId);

  if (productoActualizado.stock_actual < productoActualizado.cantidad_minima) {
    await broker.publicar(EVENTO.STOCK_BAJO, productoActualizado);
  }

  return salida;
}

async function consultarMaterialesDeProyecto(proyectoId) {
  await proyectosService.verificarQueExiste(proyectoId);
  return repositorio.materialesPorProyecto(proyectoId);
}

module.exports = { registrarSalida, consultarMaterialesDeProyecto };
