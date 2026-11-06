const { EventEmitter } = require("node:events");
const amqp = require("amqplib");
const { configuracion } = require("./configuracion");
const logger = require("./logger");

const interno = new EventEmitter();
let canal = null;
let conexion = null;

async function conectar() {
  if (!configuracion.broker.url || canal) return;
  conexion = await amqp.connect(configuracion.broker.url);
  canal = await conexion.createChannel();
  await canal.assertExchange(configuracion.broker.exchange, "topic", { durable: true });
}

async function publicar(evento, datos) {
  if (!canal) {
    interno.emit(evento, datos);
    return;
  }
  canal.publish(configuracion.broker.exchange, evento, Buffer.from(JSON.stringify(datos)), { persistent: true });
}

async function suscribir(evento, manejador) {
  const ejecutar = async (datos) => {
    try {
      await manejador(datos);
    } catch (error) {
      logger.error({ err: error, evento }, "Fallo al procesar el evento");
    }
  };
  if (!canal) {
    interno.on(evento, ejecutar);
    return;
  }
  const cola = `${configuracion.broker.exchange}.${evento}`;
  await canal.assertQueue(cola, { durable: true });
  await canal.bindQueue(cola, configuracion.broker.exchange, evento);
  await canal.consume(cola, async (mensaje) => {
    if (!mensaje) return;
    await ejecutar(JSON.parse(mensaje.content.toString()));
    canal.ack(mensaje);
  });
}

async function cerrar() {
  if (canal) await canal.close();
  if (conexion) await conexion.close();
  canal = null;
  conexion = null;
}

module.exports = { conectar, publicar, suscribir, cerrar };
