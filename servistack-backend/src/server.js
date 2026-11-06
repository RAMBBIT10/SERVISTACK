require("dotenv").config();
process.env.TZ = "UTC";
require("./transversal/telemetria");

const { configuracion, variablesFaltantes } = require("./transversal/configuracion");
const logger = require("./transversal/logger");

const faltantes = variablesFaltantes();
if (faltantes.length) {
  logger.error({ faltantes }, "Faltan variables de entorno");
  process.exit(1);
}

const app = require("./app");

const broker = require("./transversal/broker");
const { iniciarSuscriptores } = require("./modulos/notificaciones/servicios/suscriptores");

async function arrancar() {
  await broker.conectar();
  await iniciarSuscriptores();
  app.listen(configuracion.puerto, () => {
    logger.info(`ServiStack backend escuchando en el puerto ${configuracion.puerto}`);
  });
}

arrancar().catch((error) => {
  logger.error({ err: error }, "No se pudo arrancar el backend");
  process.exit(1);
});
