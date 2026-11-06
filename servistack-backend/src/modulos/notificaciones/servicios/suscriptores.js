const broker = require("../../../transversal/broker");
const { EVENTO } = require("../../../transversal/estados");
const servicio = require("./notificaciones.service");

async function iniciarSuscriptores() {
  await broker.suscribir(EVENTO.STOCK_BAJO, (producto) => servicio.notificarStockBajo(producto));
}

module.exports = { iniciarSuscriptores };
