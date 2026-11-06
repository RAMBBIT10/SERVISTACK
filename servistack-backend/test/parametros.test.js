const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.REDIS_URL = "redis://127.0.0.1:1";
const db = require("../src/transversal/db");
const cache = require("../src/transversal/cache");
const parametros = require("../src/transversal/parametros");

test.after(() => cache.cerrarCache());
test.afterEach(() => test.mock.restoreAll());

test("devuelve el valor guardado en la tabla parametro", async () => {
  test.mock.method(db, "consultar", async () => ({ rows: [{ valor: "450" }] }));
  assert.strictEqual(await parametros.obtenerNumero("qr_ancho", 300), 450);
});

test("si el parametro no existe devuelve el valor por defecto", async () => {
  test.mock.method(db, "consultar", async () => ({ rows: [] }));
  assert.strictEqual(await parametros.obtenerNumero("otro", 7), 7);
});

test("si el valor no es numerico devuelve el valor por defecto", async () => {
  test.mock.method(db, "consultar", async () => ({ rows: [{ valor: "abc" }] }));
  assert.strictEqual(await parametros.obtenerNumero("qr_ancho", 300), 300);
});
