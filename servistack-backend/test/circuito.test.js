const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.CIRCUITO_PORCENTAJE_ERROR = "10";
const { protegido } = require("../src/transversal/circuito");

test("el circuito pasa el resultado cuando la accion funciona", async () => {
  const circuito = protegido("ok", async (a) => a + 1);
  assert.strictEqual(await circuito.fire(1), 2);
  circuito.shutdown();
});

test("despues de fallar varias veces el circuito se abre y rechaza sin llamar", async () => {
  let llamadas = 0;
  const circuito = protegido("falla", async () => {
    llamadas++;
    throw new Error("caido");
  });
  for (let i = 0; i < 12; i++) await circuito.fire().catch(() => {});
  const antes = llamadas;
  await circuito.fire().catch(() => {});
  assert.strictEqual(circuito.opened, true);
  assert.strictEqual(llamadas, antes);
  circuito.shutdown();
});
