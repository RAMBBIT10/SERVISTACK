const db = require("../../../../transversal/db");

async function crear({ nombre, categoria, codigo, cantidadMinima }) {
  const resultado = await db.consultar(
    `INSERT INTO producto (nombre, categoria, codigo, cantidad_minima, stock_actual)
     VALUES ($1, $2, $3, COALESCE($4, 0), 0) RETURNING *`,
    [nombre, categoria, codigo, cantidadMinima]
  );
  return resultado.rows[0];
}

async function buscarPorId(id) {
  const resultado = await db.consultar("SELECT * FROM producto WHERE id = $1", [id]);
  return resultado.rows[0] || null;
}

async function bloquearPorId(id, cliente) {
  const resultado = await db.consultar("SELECT * FROM producto WHERE id = $1 FOR UPDATE", [id], cliente);
  return resultado.rows[0] || null;
}

async function listar() {
  const resultado = await db.consultar("SELECT * FROM producto ORDER BY nombre");
  return resultado.rows;
}

async function listarStockBajo() {
  const resultado = await db.consultar(
    "SELECT * FROM producto WHERE stock_actual < cantidad_minima ORDER BY nombre"
  );
  return resultado.rows;
}

async function ajustarStock(id, cambio, cliente) {
  const resultado = await db.consultar(
    "UPDATE producto SET stock_actual = stock_actual + $1 WHERE id = $2 RETURNING *",
    [cambio, id],
    cliente
  );
  return resultado.rows[0] || null;
}

async function guardarFoto(id, clave) {
  const resultado = await db.consultar("UPDATE producto SET foto_clave = $1 WHERE id = $2 RETURNING *", [clave, id]);
  return resultado.rows[0] || null;
}

async function buscarEnlacePorProducto(productoId) {
  const resultado = await db.consultar("SELECT codigo, producto_id FROM enlace_corto WHERE producto_id = $1", [productoId]);
  return resultado.rows[0] || null;
}

async function buscarEnlace(codigo) {
  const resultado = await db.consultar("SELECT codigo, producto_id FROM enlace_corto WHERE codigo = $1", [codigo]);
  return resultado.rows[0] || null;
}

async function crearEnlace(codigo, productoId) {
  const resultado = await db.consultar(
    `INSERT INTO enlace_corto (codigo, producto_id) VALUES ($1, $2)
     ON CONFLICT (producto_id) DO UPDATE SET producto_id = EXCLUDED.producto_id
     RETURNING codigo, producto_id`,
    [codigo, productoId]
  );
  return resultado.rows[0];
}

module.exports = { guardarFoto, buscarEnlacePorProducto, buscarEnlace, crearEnlace, crear, buscarPorId, bloquearPorId, listar, listarStockBajo, ajustarStock };
