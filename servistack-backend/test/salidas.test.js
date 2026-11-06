const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.REDIS_URL = "redis://127.0.0.1:1";
const db = require("../src/transversal/db");
const cache = require("../src/transversal/cache");
const productos = require("../src/modulos/productos/servicios/productos.service");
const proyectos = require("../src/modulos/proyectos/servicios/proyectos.service");
const broker = require("../src/transversal/broker");
const repositorio = require("../src/modulos/salidas/infraestructura/output/salidas.repository");
const servicio = require("../src/modulos/salidas/servicios/salidas.service");

const datos = { proyectoId: 1, productoId: 5, cantidad: 3 };

test.after(() => cache.cerrarCache());
test.afterEach(() => test.mock.restoreAll());

function prepararFlujo(stockInicial, minimo) {
  test.mock.method(db, "transaccion", async (callback) => callback({}));
  test.mock.method(proyectos, "verificarQueExiste", async () => ({ id: 1 }));
  test.mock.method(productos, "bloquearProducto", async () => ({ id: 5, nombre: "Tubo", stock_actual: stockInicial, cantidad_minima: minimo }));
  test.mock.method(productos, "ajustarStock", async () => ({ id: 5, nombre: "Tubo", stock_actual: stockInicial - datos.cantidad, cantidad_minima: minimo }));
  test.mock.method(productos, "invalidarCacheProducto", async () => {});
  return {
    crear: test.mock.method(repositorio, "crear", async () => ({ id: 10 })),
    notificar: test.mock.method(broker, "publicar", async () => {}),
  };
}

test("sin stock suficiente lanza STOCK_INSUFICIENTE y no registra la salida", async () => {
  const { crear } = prepararFlujo(2, 1);
  await assert.rejects(servicio.registrarSalida(datos), (error) => error.codigo === "STOCK_INSUFICIENTE" && error.status === 422 && error.valores.disponible === 2);
  assert.strictEqual(crear.mock.callCount(), 0);
});

test("con stock registra la salida, descuenta y limpia la cache", async () => {
  const { crear, notificar } = prepararFlujo(10, 2);
  const salida = await servicio.registrarSalida(datos);
  assert.deepStrictEqual(salida, { id: 10 });
  assert.strictEqual(crear.mock.callCount(), 1);
  assert.strictEqual(productos.ajustarStock.mock.calls[0].arguments[1], -3);
  assert.strictEqual(productos.invalidarCacheProducto.mock.callCount(), 1);
  assert.strictEqual(notificar.mock.callCount(), 0);
});

test("si el stock queda bajo el minimo envia la notificacion", async () => {
  const { notificar } = prepararFlujo(4, 3);
  await servicio.registrarSalida(datos);
  assert.strictEqual(notificar.mock.callCount(), 1);
});

test("una cantidad invalida se rechaza antes de abrir la transaccion", async () => {
  const transaccion = test.mock.method(db, "transaccion", async (callback) => callback({}));
  await assert.rejects(servicio.registrarSalida({ ...datos, cantidad: 0 }), (error) => error.codigo === "DATOS_MOVIMIENTO_INVALIDOS");
  assert.strictEqual(transaccion.mock.callCount(), 0);
});
