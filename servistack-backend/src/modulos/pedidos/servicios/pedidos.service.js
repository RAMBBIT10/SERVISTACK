const repositorio = require("../infraestructura/output/pedidos.repository");
const { ErrorNegocio } = require("../../../transversal/errores");
const { faltanCampos } = require("../../../transversal/validaciones");

async function crearPedido(datos) {
  if (faltanCampos(datos, ["proveedor"])) throw new ErrorNegocio("PROVEEDOR_OBLIGATORIO", 400);
  return repositorio.crear(datos.proveedor);
}

async function consultarPedido(id) {
  const pedido = await repositorio.buscarPorId(id);
  if (!pedido) throw new ErrorNegocio("PEDIDO_NO_ENCONTRADO", 404);
  return pedido;
}

async function verificarQueExiste(id, cliente) {
  const pedido = await repositorio.buscarPorId(id, cliente);
  if (!pedido) throw new ErrorNegocio("PEDIDO_NO_ENCONTRADO", 422);
  return pedido;
}

module.exports = { crearPedido, consultarPedido, verificarQueExiste };
