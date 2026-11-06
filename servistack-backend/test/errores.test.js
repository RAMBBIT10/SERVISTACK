const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
const mensajes = require("../src/transversal/mensajes");
const { ErrorNegocio, manejadorErrores } = require("../src/transversal/errores");

function respuestaFalsa() {
  const res = { estado: null, cuerpo: null };
  res.status = (codigo) => {
    res.estado = codigo;
    return res;
  };
  res.json = (cuerpo) => {
    res.cuerpo = cuerpo;
    return res;
  };
  return res;
}

test.afterEach(() => test.mock.restoreAll());

test("un error de negocio responde con su estado y el mensaje del catalogo", async () => {
  test.mock.method(mensajes, "obtener", async () => "No hay stock suficiente");
  const res = respuestaFalsa();
  await manejadorErrores(new ErrorNegocio("STOCK_INSUFICIENTE", 422), {}, res, () => {});
  assert.strictEqual(res.estado, 422);
  assert.deepStrictEqual(res.cuerpo, { codigo: "STOCK_INSUFICIENTE", error: "No hay stock suficiente" });
});

test("un error inesperado responde 500 sin mostrar detalles internos", async () => {
  test.mock.method(mensajes, "obtener", async () => "Algo salio mal");
  const res = respuestaFalsa();
  await manejadorErrores(new Error("password de la base: 1234"), {}, res, () => {});
  assert.strictEqual(res.estado, 500);
  assert.strictEqual(res.cuerpo.codigo, "ERROR_INTERNO");
  assert.doesNotMatch(JSON.stringify(res.cuerpo), /1234/);
});
