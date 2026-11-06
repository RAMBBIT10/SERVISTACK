const test = require("node:test");
const assert = require("node:assert");
process.env.LOG_LEVEL = "silent";
process.env.FCM_TOPICO_STOCK_BAJO = "topico-de-prueba";
const push = require("../src/transversal/notificaciones-push");
const mensajes = require("../src/transversal/mensajes");
const repositorio = require("../src/modulos/notificaciones/infraestructura/output/notificaciones.repository");
const servicio = require("../src/modulos/notificaciones/servicios/notificaciones.service");

const producto = { id: 5, nombre: "Tubo PVC 4 pulgadas", stock_actual: 2 };

test.afterEach(() => test.mock.restoreAll());

test("el stock bajo guarda la notificacion y envia el push al topico configurado", async () => {
  test.mock.method(mensajes, "obtener", async (codigo) => codigo);
  const crear = test.mock.method(repositorio, "crear", async () => ({}));
  const enviar = test.mock.method(push, "enviarAlTopico", async () => "ok");
  await servicio.notificarStockBajo(producto);
  assert.strictEqual(crear.mock.callCount(), 1);
  assert.strictEqual(enviar.mock.calls[0].arguments[0], "topico-de-prueba");
});

test("si el push falla la notificacion igual queda guardada y no se lanza error", async () => {
  test.mock.method(mensajes, "obtener", async (codigo) => codigo);
  const crear = test.mock.method(repositorio, "crear", async () => ({}));
  test.mock.method(push, "enviarAlTopico", async () => {
    throw new Error("FCM caido");
  });
  await assert.doesNotReject(servicio.notificarStockBajo(producto));
  assert.strictEqual(crear.mock.callCount(), 1);
});

test("marcar como leida una notificacion inexistente lanza NOTIFICACION_NO_ENCONTRADA", async () => {
  test.mock.method(repositorio, "marcarLeida", async () => null);
  await assert.rejects(servicio.marcarComoLeida(99), (error) => error.codigo === "NOTIFICACION_NO_ENCONTRADA" && error.status === 404);
});
