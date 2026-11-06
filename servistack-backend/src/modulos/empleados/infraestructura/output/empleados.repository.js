const db = require("../../../../transversal/db");

async function crear({ nombre, correo, tipoEmpleado }) {
  const resultado = await db.consultar(
    "INSERT INTO empleado (nombre, correo, tipo_empleado) VALUES ($1, $2, $3) RETURNING *",
    [nombre, correo, tipoEmpleado]
  );
  return resultado.rows[0];
}

async function listar() {
  const resultado = await db.consultar("SELECT id, nombre, correo, tipo_empleado FROM empleado ORDER BY nombre");
  return resultado.rows;
}

async function eliminar(id) {
  await db.consultar("DELETE FROM empleado WHERE id = $1", [id]);
}

module.exports = { crear, listar, eliminar };
