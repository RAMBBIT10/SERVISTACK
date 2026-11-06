const obligatorias = [
  "DATABASE_URL",
  "REDIS_URL",
  "AUTH0_AUDIENCE",
  "AUTH0_ISSUER_BASE_URL",
  "AUTH0_CLAIM_TIPO_EMPLEADO",
  "FCM_TOPICO_STOCK_BAJO",
  "FRONTEND_URL",
  "ENLACE_CORTO_BASE",
  "ZONA_HORARIA_VISUAL",
  "LOCALE_FECHAS",
];

const configuracion = {
  puerto: Number(process.env.PORT) || 3000,
  baseDeDatos: {
    url: process.env.DATABASE_URL,
    esquemas: process.env.DB_ESQUEMAS || "empleados,productos,pedidos,entradas,proyectos,salidas,notificaciones,compartido,public",
  },
  cache: {
    url: process.env.REDIS_URL,
    segundosVida: Number(process.env.CACHE_SEGUNDOS) || 30,
  },
  autenticacion: {
    audience: process.env.AUTH0_AUDIENCE,
    emisor: process.env.AUTH0_ISSUER_BASE_URL,
    claimTipoEmpleado: process.env.AUTH0_CLAIM_TIPO_EMPLEADO,
  },
  push: { topicoStockBajo: process.env.FCM_TOPICO_STOCK_BAJO },
  frontend: { url: process.env.FRONTEND_URL },
  fechas: { zonaVisual: process.env.ZONA_HORARIA_VISUAL, locale: process.env.LOCALE_FECHAS },
  almacenamiento: {
    endpoint: process.env.R2_ENDPOINT,
    bucket: process.env.R2_BUCKET,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    segundosUrl: Number(process.env.R2_SEGUNDOS_URL) || 300,
  },
  enlaceCorto: { base: process.env.ENLACE_CORTO_BASE, largo: Number(process.env.ENLACE_CORTO_LARGO) || 7 },
  qr: { ancho: Number(process.env.QR_ANCHO) || 300 },
  broker: { url: process.env.BROKER_URL, exchange: process.env.BROKER_EXCHANGE || "servistack.eventos" },
  circuito: {
    tiempoMaximoMs: Number(process.env.CIRCUITO_TIEMPO_MS) || 5000,
    porcentajeError: Number(process.env.CIRCUITO_PORCENTAJE_ERROR) || 50,
    reinicioMs: Number(process.env.CIRCUITO_REINICIO_MS) || 30000,
  },
  parametros: { segundosCache: Number(process.env.PARAMETROS_CACHE_SEGUNDOS) || 60 },
};

function variablesFaltantes() {
  return obligatorias.filter((nombre) => !process.env[nombre]);
}

module.exports = { configuracion, variablesFaltantes };
