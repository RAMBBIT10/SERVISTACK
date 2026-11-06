const db = require("../../../../transversal/db");
const { MOVIMIENTO } = require("../../../../transversal/estados");

async function crear({ pedidoId, productoId, cantidad }, cliente) {
  const resultado = await db.consultar(
    `INSERT INTO entrada (pedido_id, producto_id, cantidad, estado)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [pedidoId, productoId, cantidad, MOVIMIENTO.COMPLETADA],
    cliente
  );
  return resultado.rows[0];
}

module.exports = { crear };
