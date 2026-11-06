const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.REDIS_URL = "redis://127.0.0.1:1";
const cache = require("../src/transversal/cache");
const repositorio = require("../src/modulos/productos/infraestructura/output/productos.repository");
const parametros = require("../src/transversal/parametros");
const servicio = require("../src/modulos/productos/servicios/productos.service");

test.after(() => cache.cerrarCache());
test.afterEach(() => test.mock.restoreAll());

test("consultar un producto que esta en cache no toca la base de datos", async () => {
  test.mock.method(cache, "obtenerDeCache", async () => ({ id: 1, nombre: "Tubo PVC" }));
  const buscar = test.mock.method(repositorio, "buscarPorId", async () => null);
  const producto = await servicio.consultarProducto(1);
  assert.strictEqual(producto.origen, "cache");
  assert.strictEqual(buscar.mock.callCount(), 0);
});

test("consultar un producto inexistente lanza PRODUCTO_NO_ENCONTRADO", async () => {
  test.mock.method(cache, "obtenerDeCache", async () => null);
  test.mock.method(repositorio, "buscarPorId", async () => null);
  await assert.rejects(servicio.consultarProducto(99), (error) => error.codigo === "PRODUCTO_NO_ENCONTRADO" && error.status === 404);
});

test("crear un producto sin codigo lanza DATOS_PRODUCTO_INCOMPLETOS", async () => {
  await assert.rejects(servicio.crearProducto({ nombre: "Codo", categoria: "PVC" }), (error) => error.codigo === "DATOS_PRODUCTO_INCOMPLETOS");
});

test("el QR de un producto es una imagen PNG", async () => {
  test.mock.method(repositorio, "buscarPorId", async () => ({ id: 1, codigo: "SERV-000123" }));
  test.mock.method(parametros, "obtenerNumero", async (clave, porDefecto) => porDefecto);
  const imagen = await servicio.generarQr(1);
  assert.deepStrictEqual([...imagen.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
});

test("el stock bajo se pide a la base de datos", async () => {
  const listar = test.mock.method(repositorio, "listarStockBajo", async () => [{ id: 2 }]);
  assert.deepStrictEqual(await servicio.listarStockBajo(), [{ id: 2 }]);
  assert.strictEqual(listar.mock.callCount(), 1);
});
