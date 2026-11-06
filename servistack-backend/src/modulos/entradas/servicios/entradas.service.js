const repositorio = require("../infraestructura/output/entradas.repository");
const productosService = require("../../productos/servicios/productos.service");
const pedidosService = require("../../pedidos/servicios/pedidos.service");
const db = require("../../../transversal/db");
const { ErrorNegocio } = require("../../../transversal/errores");
const { faltanCampos, esEnteroPositivo } = require("../../../transversal/validaciones");

async function registrarEntrada(datos) {
  if (faltanCampos(datos, ["pedidoId", "productoId", "cantidad"]) || !esEnteroPositivo(datos.cantidad)) {
    throw new ErrorNegocio("DATOS_MOVIMIENTO_INVALIDOS", 400);
  }

  const entrada = await db.transaccion(async (cliente) => {
    await pedidosService.verificarQueExiste(datos.pedidoId, cliente);
    await productosService.bloquearProducto(datos.productoId, cliente);
    const nueva = await repositorio.crear(datos, cliente);
    await productosService.ajustarStock(datos.productoId, datos.cantidad, cliente);
    return nueva;
  });

  await productosService.invalidarCacheProducto(datos.productoId);
  return entrada;
}

module.exports = { registrarEntrada };
