const { Pool } = require("pg");
const { configuracion } = require("./configuracion");

const pool = new Pool({
  connectionString: configuracion.baseDeDatos.url,
  options: `-c timezone=UTC -c search_path=${configuracion.baseDeDatos.esquemas}`,
});

async function consultar(texto, parametros, cliente) {
  return (cliente || pool).query(texto, parametros);
}

async function transaccion(callback) {
  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");
    const resultado = await callback(cliente);
    await cliente.query("COMMIT");
    return resultado;
  } catch (error) {
    await cliente.query("ROLLBACK");
    throw error;
  } finally {
    cliente.release();
  }
}

module.exports = { pool, consultar, transaccion };
