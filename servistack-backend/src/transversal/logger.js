const pino = require("pino");
const { trace } = require("@opentelemetry/api");
const { obtenerContexto } = require("./contexto");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: { servicio: process.env.OTEL_SERVICE_NAME },
  timestamp: () => `,"hora":"${new Date().toISOString()}"`,
  messageKey: "mensaje",
  formatters: { level: (etiqueta) => ({ nivel: etiqueta }) },
  redact: ["req.headers.authorization", "*.password", "*.token"],
  mixin() {
    const datos = { ...obtenerContexto() };
    const span = trace.getActiveSpan();
    if (span) {
      const { traceId, spanId } = span.spanContext();
      datos.trace_id = traceId;
      datos.span_id = spanId;
    }
    return datos;
  },
});

module.exports = logger;
