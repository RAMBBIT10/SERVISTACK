import { ConfiguracionService } from './configuracion.service';

export function aFechaLocal(fechaUtc: string, configuracion: ConfiguracionService): string {
  return new Date(fechaUtc).toLocaleString(configuracion.config.localeFechas);
}
