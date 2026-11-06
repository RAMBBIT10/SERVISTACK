const express = require("express");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { middlewareContexto } = require("./transversal/middleware-contexto");
const { ErrorNegocio, manejadorErrores } = require("./transversal/errores");

const productosRoutes = require("./modulos/productos/infraestructura/input/productos.routes");
const enlacesRoutes = require("./modulos/productos/infraestructura/input/enlaces.routes");
const empleadosRoutes = require("./modulos/empleados/infraestructura/input/empleados.routes");
const pedidosRoutes = require("./modulos/pedidos/infraestructura/input/pedidos.routes");
const entradasRoutes = require("./modulos/entradas/infraestructura/input/entradas.routes");
const salidasRoutes = require("./modulos/salidas/infraestructura/input/salidas.routes");
const proyectosRoutes = require("./modulos/proyectos/infraestructura/input/proyectos.routes");
const notificacionesRoutes = require("./modulos/notificaciones/infraestructura/input/notificaciones.routes");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(middlewareContexto);
app.use(express.json());

app.get("/salud", (req, res) => {
  res.json({ estado: "ServiStack backend funcionando" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/productos", productosRoutes);
app.use("/c", enlacesRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/pedidos", pedidosRoutes);
app.use("/entradas", entradasRoutes);
app.use("/salidas", salidasRoutes);
app.use("/proyectos", proyectosRoutes);
app.use("/notificaciones", notificacionesRoutes);

app.use((req, res, next) => next(new ErrorNegocio("RUTA_NO_ENCONTRADA", 404)));
app.use(manejadorErrores);

module.exports = app;
