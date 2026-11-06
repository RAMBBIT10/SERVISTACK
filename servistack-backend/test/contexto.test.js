const test = require("node:test");
const assert = require("node:assert");
const { ejecutarConContexto, obtenerContexto, agregarAlContexto } = require("../src/transversal/contexto");

test("el contexto se mantiene a traves de await y no se mezcla entre peticiones", async () => {
  const leer = async (id, espera) =>
    ejecutarConContexto({ id_peticion: id }, async () => {
      await new Promise((resolver) => setTimeout(resolver, espera));
      agregarAlContexto("usuario_id", "u-" + id);
      return obtenerContexto();
    });
  const [a, b] = await Promise.all([leer("A", 30), leer("B", 5)]);
  assert.deepStrictEqual([a.id_peticion, a.usuario_id], ["A", "u-A"]);
  assert.deepStrictEqual([b.id_peticion, b.usuario_id], ["B", "u-B"]);
});
