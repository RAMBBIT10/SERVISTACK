const db = require("../../../../transversal/db");

async function crear({ tipo, productoId, mensaje }) {
  const resultado = await db.consultar(
    "INSERT INTO notificacion (tipo, producto_id, mensaje, leida) VALUES ($1, $2, $3, false) RETURNING *",
    [tipo, productoId, mensaje]
  );
  return resultado.rows[0];
}

async function listar() {
  const resultado = await db.consultar("SELECT * FROM notificacion ORDER BY id DESC");
  return resultado.rows;
}

async function marcarLeida(id) {
  const resultado = await db.consultar(
    "UPDATE notificacion SET leida = true WHERE id = $1 RETURNING id",
    [id]
  );
  return resultado.rows[0] || null;
}

module.exports = { crear, listar, marcarLeida };
