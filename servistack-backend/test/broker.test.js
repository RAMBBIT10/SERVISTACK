const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
const broker = require("../src/transversal/broker");

test("sin broker externo el evento llega a quien se suscribio", async () => {
  const recibidos = [];
  await broker.suscribir("prueba.evento", async (datos) => recibidos.push(datos));
  await broker.publicar("prueba.evento", { id: 1 });
  assert.deepStrictEqual(recibidos, [{ id: 1 }]);
});

test("si el suscriptor falla, publicar no lanza error", async () => {
  await broker.suscribir("prueba.fallo", async () => {
    throw new Error("falla");
  });
  await assert.doesNotReject(broker.publicar("prueba.fallo", {}));
});
