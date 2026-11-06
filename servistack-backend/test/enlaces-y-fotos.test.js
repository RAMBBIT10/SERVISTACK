const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.REDIS_URL = "redis://127.0.0.1:1";
process.env.FRONTEND_URL = "https://servistack.test";
process.env.ENLACE_CORTO_BASE = "https://api.servistack.test/c";
process.env.R2_ENDPOINT = "https://cuenta.r2.cloudflarestorage.com";
process.env.R2_BUCKET = "fotos";
process.env.R2_ACCESS_KEY_ID = "clave";
process.env.R2_SECRET_ACCESS_KEY = "secreto";
const cache = require("../src/transversal/cache");
const repositorio = require("../src/modulos/productos/infraestructura/output/productos.repository");
const servicio = require("../src/modulos/productos/servicios/productos.service");

test.after(() => cache.cerrarCache());
test.afterEach(() => test.mock.restoreAll());

test("crear el enlace corto genera un codigo del largo configurado", async () => {
  test.mock.method(repositorio, "buscarPorId", async () => ({ id: 5 }));
  test.mock.method(repositorio, "buscarEnlacePorProducto", async () => null);
  test.mock.method(repositorio, "crearEnlace", async (codigo, id) => ({ codigo, producto_id: id }));
  const enlace = await servicio.crearEnlaceCorto(5);
  assert.strictEqual(enlace.codigo.length, 7);
  assert.strictEqual(enlace.url, `https://api.servistack.test/c/${enlace.codigo}`);
});

test("si el producto ya tiene enlace se devuelve el mismo", async () => {
  test.mock.method(repositorio, "buscarPorId", async () => ({ id: 5 }));
  test.mock.method(repositorio, "buscarEnlacePorProducto", async () => ({ codigo: "abc1234", producto_id: 5 }));
  const crear = test.mock.method(repositorio, "crearEnlace", async () => null);
  const enlace = await servicio.crearEnlaceCorto(5);
  assert.strictEqual(enlace.codigo, "abc1234");
  assert.strictEqual(crear.mock.callCount(), 0);
});

test("resolver un enlace lleva a la pagina del producto", async () => {
  test.mock.method(repositorio, "buscarEnlace", async () => ({ codigo: "abc1234", producto_id: 9 }));
  assert.strictEqual(await servicio.resolverEnlaceCorto("abc1234"), "https://servistack.test/productos/9");
});

test("un enlace que no existe da error 404", async () => {
  test.mock.method(repositorio, "buscarEnlace", async () => null);
  await assert.rejects(servicio.resolverEnlaceCorto("nada"), (e) => e.status === 404 && e.codigo === "ENLACE_NO_ENCONTRADO");
});

test("la url de subida de foto apunta al bucket y a la carpeta del producto", async () => {
  test.mock.method(repositorio, "buscarPorId", async () => ({ id: 3 }));
  const { clave, url } = await servicio.pedirUrlDeFoto(3, "image/png");
  assert.match(clave, /^productos\/3\/.+\.png$/);
  assert.ok(url.includes("r2.cloudflarestorage.com"));
  assert.ok(url.includes("X-Amz-Signature"));
});

test("un tipo de archivo que no es imagen se rechaza", async () => {
  await assert.rejects(servicio.pedirUrlDeFoto(3, "application/pdf"), (e) => e.codigo === "TIPO_IMAGEN_INVALIDO");
  await assert.rejects(servicio.pedirUrlDeFoto(3, "constructor"), (e) => e.codigo === "TIPO_IMAGEN_INVALIDO");
});

test("confirmar una foto con la clave de otro producto se rechaza", async () => {
  await assert.rejects(servicio.confirmarFoto(3, "productos/4/x.png"), (e) => e.codigo === "FOTO_CLAVE_OBLIGATORIA");
});
