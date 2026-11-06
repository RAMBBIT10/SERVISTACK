const test = require("node:test");
process.env.ZONA_HORARIA_VISUAL = "America/Bogota";
process.env.LOCALE_FECHAS = "es-CO";
const assert = require("node:assert");
const http = require("node:http");
const { generateKeyPair, exportJWK, SignJWT } = require("jose");

process.env.LOG_LEVEL = "silent";
process.env.OTEL_SDK_DISABLED = "true";
process.env.DATABASE_URL = "postgres://prueba:prueba@127.0.0.1:1/prueba";
process.env.REDIS_URL = "redis://127.0.0.1:1";
process.env.AUTH0_AUDIENCE = "https://servistack-api";
process.env.AUTH0_CLAIM_TIPO_EMPLEADO = "https://servistack/tipo_empleado";
process.env.FCM_TOPICO_STOCK_BAJO = "stock-bajo";
process.env.FRONTEND_URL = "http://localhost:8080";
process.env.ENLACE_CORTO_BASE = "http://localhost:8000/c";

let servidorEmisor;
let servidorApi;
let urlApi;
let llavePrivada;
let emisor;
let cache;
let repositorioProductos;

async function crearToken(tipoEmpleado) {
  return new SignJWT({ "https://servistack/tipo_empleado": tipoEmpleado })
    .setProtectedHeader({ alg: "RS256", kid: "llave-de-prueba" })
    .setIssuer(emisor)
    .setAudience("https://servistack-api")
    .setSubject("usuario-de-prueba")
    .setExpirationTime("5m")
    .sign(llavePrivada);
}

async function pedir(ruta, opciones = {}) {
  return fetch(urlApi + ruta, { redirect: "manual", ...opciones });
}

function conToken(token, extra = {}) {
  return { ...extra, headers: { ...(extra.headers || {}), authorization: `Bearer ${token}` } };
}

test.before(async () => {
  const { publicKey, privateKey } = await generateKeyPair("RS256");
  llavePrivada = privateKey;
  const llavePublica = await exportJWK(publicKey);
  llavePublica.kid = "llave-de-prueba";
  llavePublica.alg = "RS256";
  llavePublica.use = "sig";

  servidorEmisor = http.createServer((req, res) => {
    res.setHeader("content-type", "application/json");
    if (req.url.endsWith("openid-configuration")) {
      return res.end(JSON.stringify({ issuer: emisor, jwks_uri: emisor + ".well-known/jwks.json" }));
    }
    res.end(JSON.stringify({ keys: [llavePublica] }));
  });
  await new Promise((resolver) => servidorEmisor.listen(0, "127.0.0.1", resolver));
  emisor = `http://127.0.0.1:${servidorEmisor.address().port}/`;
  process.env.AUTH0_ISSUER_BASE_URL = emisor;

  cache = require("../src/transversal/cache");
  repositorioProductos = require("../src/modulos/productos/infraestructura/output/productos.repository");
  const app = require("../src/app");
  servidorApi = http.createServer(app);
  await new Promise((resolver) => servidorApi.listen(0, "127.0.0.1", resolver));
  urlApi = `http://127.0.0.1:${servidorApi.address().port}`;
});

test.after(async () => {
  await new Promise((resolver) => servidorApi.close(resolver));
  await new Promise((resolver) => servidorEmisor.close(resolver));
  await cache.cerrarCache();
});

test.afterEach(() => test.mock.restoreAll());

test("la ruta de salud responde sin pedir token", async () => {
  const respuesta = await pedir("/salud");
  assert.strictEqual(respuesta.status, 200);
  assert.ok((await respuesta.json()).estado);
});

test("cada respuesta trae el identificador de la peticion", async () => {
  const respuesta = await pedir("/salud", { headers: { "x-request-id": "abc-123" } });
  assert.strictEqual(respuesta.headers.get("x-request-id"), "abc-123");
});

test("las respuestas llevan cabeceras de seguridad y no revelan que usan Express", async () => {
  const respuesta = await pedir("/salud");
  assert.strictEqual(respuesta.headers.get("x-content-type-options"), "nosniff");
  assert.ok(respuesta.headers.get("strict-transport-security"));
  assert.strictEqual(respuesta.headers.get("x-powered-by"), null);
});

test("una ruta protegida sin token responde 401", async () => {
  const respuesta = await pedir("/productos/1");
  assert.strictEqual(respuesta.status, 401);
});

test("una ruta protegida con token falso responde 401", async () => {
  const respuesta = await pedir("/productos/1", conToken("token.falso.cualquiera"));
  assert.strictEqual(respuesta.status, 401);
});

test("con token valido se consulta un producto y se devuelve JSON", async () => {
  test.mock.method(cache, "obtenerDeCache", async () => null);
  test.mock.method(cache, "guardarEnCache", async () => {});
  test.mock.method(repositorioProductos, "buscarPorId", async () => ({ id: 1, nombre: "Tubo PVC", codigo: "SERV-000001" }));
  const token = await crearToken("EMPLEADO");
  const respuesta = await pedir("/productos/1", conToken(token));
  assert.strictEqual(respuesta.status, 200);
  assert.strictEqual((await respuesta.json()).nombre, "Tubo PVC");
});

test("un producto que no existe responde 404 con su codigo de error", async () => {
  test.mock.method(cache, "obtenerDeCache", async () => null);
  test.mock.method(repositorioProductos, "buscarPorId", async () => null);
  const token = await crearToken("EMPLEADO");
  const respuesta = await pedir("/productos/999", conToken(token));
  assert.strictEqual(respuesta.status, 404);
  assert.strictEqual((await respuesta.json()).codigo, "PRODUCTO_NO_ENCONTRADO");
});

test("crear un producto incompleto responde 400", async () => {
  const token = await crearToken("ADMINISTRADOR");
  const respuesta = await pedir("/productos", conToken(token, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ nombre: "Codo" }),
  }));
  assert.strictEqual(respuesta.status, 400);
  assert.strictEqual((await respuesta.json()).codigo, "DATOS_PRODUCTO_INCOMPLETOS");
});

test("un empleado normal no puede eliminar empleados y recibe 403", async () => {
  const token = await crearToken("EMPLEADO");
  const respuesta = await pedir("/empleados/5", conToken(token, { method: "DELETE" }));
  assert.strictEqual(respuesta.status, 403);
  assert.strictEqual((await respuesta.json()).codigo, "ADMIN_REQUERIDO");
});

test("el enlace corto es publico y redirige al producto", async () => {
  test.mock.method(repositorioProductos, "buscarEnlace", async () => ({ producto_id: 7 }));
  const respuesta = await pedir("/c/abc1234");
  assert.strictEqual(respuesta.status, 302);
  assert.match(respuesta.headers.get("location"), /7/);
});

test("una ruta que no existe responde 404", async () => {
  const respuesta = await pedir("/no-existe");
  assert.strictEqual(respuesta.status, 404);
  assert.strictEqual((await respuesta.json()).codigo, "RUTA_NO_ENCONTRADA");
});
