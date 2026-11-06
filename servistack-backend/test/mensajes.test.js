const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
const db = require("../src/transversal/db");
const mensajes = require("../src/transversal/mensajes");

test.afterEach(() => {
  test.mock.restoreAll();
  mensajes.reiniciar();
});

test("devuelve el texto del catalogo y reemplaza los valores", async () => {
  test.mock.method(db, "consultar", async () => ({
    rows: [{ codigo: "STOCK_INSUFICIENTE", texto: "No hay stock. Disponible: {disponible}." }],
  }));
  assert.strictEqual(await mensajes.obtener("STOCK_INSUFICIENTE", { disponible: 4 }), "No hay stock. Disponible: 4.");
});

test("si el codigo no existe devuelve el mismo codigo", async () => {
  test.mock.method(db, "consultar", async () => ({ rows: [] }));
  assert.strictEqual(await mensajes.obtener("CODIGO_RARO"), "CODIGO_RARO");
});

test("si la base de datos falla no lanza error", async () => {
  test.mock.method(db, "consultar", async () => {
    throw new Error("sin conexion");
  });
  assert.strictEqual(await mensajes.obtener("ERROR_INTERNO"), "ERROR_INTERNO");
});
