import { HttpErrorResponse } from '@angular/common/http';
import { ConfiguracionService } from './configuracion.service';

export function textoDeError(error: unknown, configuracion: ConfiguracionService): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return configuracion.texto('error.sinConexion');
    return error.error?.error ?? configuracion.texto('error.generico');
  }
  return configuracion.texto('error.generico');
}
