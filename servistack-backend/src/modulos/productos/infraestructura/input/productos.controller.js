const servicio = require("../../servicios/productos.service");

async function crear(req, res) {
  const producto = await servicio.crearProducto(req.body);
  res.status(201).json(producto);
}

async function consultarPorId(req, res) {
  res.json(await servicio.consultarProducto(req.params.id));
}

async function listar(req, res) {
  res.json(await servicio.listarProductos());
}

async function listarStockBajo(req, res) {
  res.json(await servicio.listarStockBajo());
}

async function descargarQr(req, res) {
  const imagen = await servicio.generarQr(req.params.id);
  res.type("png").send(imagen);
}

async function pedirUrlDeFoto(req, res) {
  res.json(await servicio.pedirUrlDeFoto(req.params.id, req.body.tipoContenido));
}

async function confirmarFoto(req, res) {
  res.json(await servicio.confirmarFoto(req.params.id, req.body.clave));
}

async function crearEnlaceCorto(req, res) {
  res.json(await servicio.crearEnlaceCorto(req.params.id));
}

async function redirigirEnlace(req, res) {
  res.redirect(await servicio.resolverEnlaceCorto(req.params.codigo));
}

module.exports = { pedirUrlDeFoto, confirmarFoto, crearEnlaceCorto, redirigirEnlace, crear, consultarPorId, listar, listarStockBajo, descargarQr };
