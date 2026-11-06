const db = require("../../../../transversal/db");
const { MOVIMIENTO } = require("../../../../transversal/estados");

async function crear({ proyectoId, productoId, cantidad }, cliente) {
  const resultado = await db.consultar(
    `INSERT INTO salida (proyecto_id, producto_id, cantidad, estado)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [proyectoId, productoId, cantidad, MOVIMIENTO.COMPLETADA],
    cliente
  );
  return resultado.rows[0];
}

async function materialesPorProyecto(proyectoId) {
  const resultado = await db.consultar(
    `SELECT s.producto_id, SUM(s.cantidad)::int AS cantidad_usada
     FROM salida s WHERE s.proyecto_id = $1 GROUP BY s.producto_id`,
    [proyectoId]
  );
  return resultado.rows;
}

module.exports = { crear, materialesPorProyecto };
