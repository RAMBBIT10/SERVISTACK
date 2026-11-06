const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.REDIS_URL = "redis://127.0.0.1:1";
const cache = require("../src/transversal/cache");

test.after(() => cache.cerrarCache());

test("si Redis no responde, la cache devuelve vacio y no lanza error", async () => {
  assert.strictEqual(await cache.obtenerDeCache("producto:1"), null);
  await assert.doesNotReject(cache.guardarEnCache("producto:1", { id: 1 }));
  await assert.doesNotReject(cache.invalidarCache("producto:1"));
});
