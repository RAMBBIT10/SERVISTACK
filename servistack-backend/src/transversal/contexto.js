const { AsyncLocalStorage } = require("node:async_hooks");

const almacen = new AsyncLocalStorage();

function ejecutarConContexto(datosIniciales, funcion) {
  return almacen.run({ ...datosIniciales }, funcion);
}

function obtenerContexto() {
  return almacen.getStore() || {};
}

function agregarAlContexto(clave, valor) {
  const contexto = almacen.getStore();
  if (contexto) contexto[clave] = valor;
}

module.exports = { ejecutarConContexto, obtenerContexto, agregarAlContexto };
