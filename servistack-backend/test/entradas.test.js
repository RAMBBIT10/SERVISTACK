const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.REDIS_URL = "redis://127.0.0.1:1";
const db = require("../src/transversal/db");
const cache = require("../src/transversal/cache");
const productos = require("../src/modulos/productos/servicios/productos.service");
const pedidos = require("../src/modulos/pedidos/servicios/pedidos.service");
const repositorio = require("../src/modulos/entradas/infraestructura/output/entradas.repository");
const servicio = require("../src/modulos/entradas/servicios/entradas.service");
const { ErrorNegocio } = require("../src/transversal/errores");

const datos = { pedidoId: 1, productoId: 5, cantidad: 8 };

test.after(() => cache.cerrarCache());
test.afterEach(() => test.mock.restoreAll());

test("si el pedido no existe no suma stock", async () => {
  test.mock.method(db, "transaccion", async (callback) => callback({}));
  test.mock.method(pedidos, "verificarQueExiste", async () => {
    throw new ErrorNegocio("PEDIDO_NO_ENCONTRADO", 422);
  });
  const ajustar = test.mock.method(productos, "ajustarStock", async () => ({}));
  await assert.rejects(servicio.registrarEntrada(datos), (error) => error.codigo === "PEDIDO_NO_ENCONTRADO");
  assert.strictEqual(ajustar.mock.callCount(), 0);
});

test("una entrada valida suma el stock y limpia la cache", async () => {
  test.mock.method(db, "transaccion", async (callback) => callback({}));
  test.mock.method(pedidos, "verificarQueExiste", async () => ({ id: 1 }));
  test.mock.method(productos, "bloquearProducto", async () => ({ id: 5 }));
  const ajustar = test.mock.method(productos, "ajustarStock", async () => ({}));
  const invalidar = test.mock.method(productos, "invalidarCacheProducto", async () => {});
  test.mock.method(repositorio, "crear", async () => ({ id: 20 }));
  assert.deepStrictEqual(await servicio.registrarEntrada(datos), { id: 20 });
  assert.strictEqual(ajustar.mock.calls[0].arguments[1], 8);
  assert.strictEqual(invalidar.mock.callCount(), 1);
});
