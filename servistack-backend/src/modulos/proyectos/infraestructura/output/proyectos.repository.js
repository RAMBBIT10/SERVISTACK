const db = require("../../../../transversal/db");
const { PROYECTO } = require("../../../../transversal/estados");

async function crear({ nombre, descripcion }) {
  const resultado = await db.consultar(
    "INSERT INTO proyecto (nombre, descripcion, estado) VALUES ($1, $2, $3) RETURNING *",
    [nombre, descripcion, PROYECTO.EN_CURSO]
  );
  return resultado.rows[0];
}

async function buscarPorId(id, cliente) {
  const resultado = await db.consultar("SELECT * FROM proyecto WHERE id = $1", [id], cliente);
  return resultado.rows[0] || null;
}

async function listar(estado) {
  const resultado = await db.consultar(
    "SELECT * FROM proyecto WHERE ($1::text IS NULL OR estado = $1) ORDER BY id DESC",
    [estado || null]
  );
  return resultado.rows;
}

module.exports = { crear, buscarPorId, listar };
