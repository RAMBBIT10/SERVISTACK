const test = require("node:test");
process.env.ZONA_HORARIA_VISUAL = "America/Bogota";
process.env.LOCALE_FECHAS = "es-CO";
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
const { parsearISO, aISO, aHoraLocal } = require("../src/transversal/tiempo");

test("acepta ISO con Z y lo devuelve igual en UTC", () => {
  assert.strictEqual(aISO(parsearISO("2026-10-14T21:51:00Z")), "2026-10-14T21:51:00.000Z");
});

test("convierte un desplazamiento a UTC", () => {
  assert.strictEqual(aISO(parsearISO("2026-10-14T16:51:00-05:00")), "2026-10-14T21:51:00.000Z");
});

test("rechaza fechas sin zona con el codigo del catalogo de mensajes", () => {
  assert.throws(() => parsearISO("2026-10-14 16:51"), (error) => error.codigo === "FECHA_FORMATO_INVALIDO" && error.status === 400);
});

test("la hora local de Bogota es UTC-5", () => {
  assert.match(aHoraLocal("2026-10-14T21:51:00Z"), /4:51/);
});
