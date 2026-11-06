const db = require("../../../../transversal/db");
const { PEDIDO } = require("../../../../transversal/estados");

async function crear(proveedor) {
  const resultado = await db.consultar(
    "INSERT INTO pedido (proveedor, estado) VALUES ($1, $2) RETURNING *",
    [proveedor, PEDIDO.CREADO]
  );
  return resultado.rows[0];
}

async function buscarPorId(id, cliente) {
  const resultado = await db.consultar("SELECT * FROM pedido WHERE id = $1", [id], cliente);
  return resultado.rows[0] || null;
}

module.exports = { crear, buscarPorId };
