const crypto = require("node:crypto");
const QRCode = require("qrcode");
const repositorio = require("../infraestructura/output/productos.repository");
const cache = require("../../../transversal/cache");
const almacenamiento = require("../../../transversal/almacenamiento");
const parametros = require("../../../transversal/parametros");
const { configuracion } = require("../../../transversal/configuracion");
const { ErrorNegocio } = require("../../../transversal/errores");
const { faltanCampos } = require("../../../transversal/validaciones");

const TIPOS_IMAGEN = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const CLAVE_LISTADO = "productos:listado";

function claveProducto(id) {
  return `producto:${id}`;
}

async function crearProducto(datos) {
  if (faltanCampos(datos, ["nombre", "categoria", "codigo"])) {
    throw new ErrorNegocio("DATOS_PRODUCTO_INCOMPLETOS", 400);
  }
  const producto = await repositorio.crear(datos);
  await cache.invalidarCache(CLAVE_LISTADO);
  return producto;
}

async function agregarFoto(producto) {
  if (!producto.foto_clave) return { ...producto, foto_url: null };
  return { ...producto, foto_url: await almacenamiento.urlDeLectura(producto.foto_clave) };
}

async function consultarProducto(id) {
  const enCache = await cache.obtenerDeCache(claveProducto(id));
  if (enCache) return { ...(await agregarFoto(enCache)), origen: "cache" };

  const producto = await repositorio.buscarPorId(id);
  if (!producto) throw new ErrorNegocio("PRODUCTO_NO_ENCONTRADO", 404);

  await cache.guardarEnCache(claveProducto(id), producto);
  return { ...(await agregarFoto(producto)), origen: "base_de_datos" };
}

async function listarProductos() {
  const enCache = await cache.obtenerDeCache(CLAVE_LISTADO);
  if (enCache) return enCache;

  const productos = await repositorio.listar();
  await cache.guardarEnCache(CLAVE_LISTADO, productos);
  return productos;
}

async function listarStockBajo() {
  return repositorio.listarStockBajo();
}

async function generarQr(id) {
  const producto = await repositorio.buscarPorId(id);
  if (!producto) throw new ErrorNegocio("PRODUCTO_NO_ENCONTRADO", 404);
  return QRCode.toBuffer(producto.codigo, { type: "png", width: await parametros.obtenerNumero("qr_ancho", configuracion.qr.ancho) });
}

async function pedirUrlDeFoto(id, tipoContenido) {
  const extension = TIPOS_IMAGEN.get(tipoContenido);
  if (!extension) throw new ErrorNegocio("TIPO_IMAGEN_INVALIDO", 400);
  const producto = await repositorio.buscarPorId(id);
  if (!producto) throw new ErrorNegocio("PRODUCTO_NO_ENCONTRADO", 404);
  const clave = `productos/${id}/${crypto.randomUUID()}.${extension}`;
  return { clave, url: await almacenamiento.urlDeSubida(clave, tipoContenido) };
}

async function confirmarFoto(id, clave) {
  if (!clave || !clave.startsWith(`productos/${id}/`)) throw new ErrorNegocio("FOTO_CLAVE_OBLIGATORIA", 400);
  const producto = await repositorio.guardarFoto(id, clave);
  if (!producto) throw new ErrorNegocio("PRODUCTO_NO_ENCONTRADO", 404);
  await invalidarCacheProducto(id);
  return agregarFoto(producto);
}

async function crearEnlaceCorto(id) {
  const producto = await repositorio.buscarPorId(id);
  if (!producto) throw new ErrorNegocio("PRODUCTO_NO_ENCONTRADO", 404);
  const existente = await repositorio.buscarEnlacePorProducto(id);
  const codigo = existente ? existente.codigo : crypto.randomBytes(8).toString("base64url").slice(0, configuracion.enlaceCorto.largo);
  const enlace = existente || (await repositorio.crearEnlace(codigo, id));
  return { codigo: enlace.codigo, url: `${configuracion.enlaceCorto.base}/${enlace.codigo}` };
}

async function resolverEnlaceCorto(codigo) {
  const enlace = await repositorio.buscarEnlace(codigo);
  if (!enlace) throw new ErrorNegocio("ENLACE_NO_ENCONTRADO", 404);
  return `${configuracion.frontend.url}/productos/${enlace.producto_id}`;
}

async function bloquearProducto(id, cliente) {
  const producto = await repositorio.bloquearPorId(id, cliente);
  if (!producto) throw new ErrorNegocio("PRODUCTO_NO_ENCONTRADO", 404);
  return producto;
}

async function ajustarStock(id, cambio, cliente) {
  return repositorio.ajustarStock(id, cambio, cliente);
}

async function invalidarCacheProducto(id) {
  await cache.invalidarCache(claveProducto(id), CLAVE_LISTADO);
}

module.exports = {
  crearProducto,
  consultarProducto,
  listarProductos,
  listarStockBajo,
  generarQr,
  pedirUrlDeFoto,
  confirmarFoto,
  crearEnlaceCorto,
  resolverEnlaceCorto,
  bloquearProducto,
  ajustarStock,
  invalidarCacheProducto,
};
