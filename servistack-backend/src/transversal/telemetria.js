const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http");
const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");

const hayColector = Boolean(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
const apagado = process.env.OTEL_SDK_DISABLED === "true";

let sdk = null;

if (!apagado) {
  sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME,
    traceExporter: hayColector ? new OTLPTraceExporter() : undefined,
    metricReader: hayColector
      ? new PeriodicExportingMetricReader({
          exporter: new OTLPMetricExporter(),
          exportIntervalMillis: Number(process.env.OTEL_EXPORT_INTERVALO_MS) || 30000,
        })
      : undefined,
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": { enabled: false },
        "@opentelemetry/instrumentation-http": {
          ignoreIncomingRequestHook: (req) => req.url === "/salud" || req.url.startsWith("/docs"),
        },
      }),
    ],
  });
  sdk.start();

  const cerrar = () => sdk.shutdown().finally(() => process.exit(0));
  process.on("SIGTERM", cerrar);
  process.on("SIGINT", cerrar);
}

module.exports = { sdk };
