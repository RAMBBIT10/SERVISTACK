const productos = require("./modulos/productos/infraestructura/input/productos.openapi");
const empleados = require("./modulos/empleados/infraestructura/input/empleados.openapi");
const pedidos = require("./modulos/pedidos/infraestructura/input/pedidos.openapi");
const entradas = require("./modulos/entradas/infraestructura/input/entradas.openapi");
const salidas = require("./modulos/salidas/infraestructura/input/salidas.openapi");
const proyectos = require("./modulos/proyectos/infraestructura/input/proyectos.openapi");
const notificaciones = require("./modulos/notificaciones/infraestructura/input/notificaciones.openapi");

module.exports = {
  openapi: "3.0.0",
  info: {
    title: "ServiStack API",
    version: "1.0.0",
    description: "API del sistema de inventario de Servingenieria",
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
  },
  paths: { ...productos, ...empleados, ...pedidos, ...entradas, ...salidas, ...proyectos, ...notificaciones },
};
