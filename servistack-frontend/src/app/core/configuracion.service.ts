import { Injectable } from '@angular/core';

export interface Configuracion {
  apiUrl: string;
  localeFechas: string;
  auth0: { dominio: string; clientId: string; audiencia: string; claimTipoEmpleado: string };
  camara: { lado: string; fps: number; lado_visor: number };
}

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private datos!: Configuracion;
  private textos: Record<string, string> = {};

  async cargar(): Promise<void> {
    const [configuracion, textos] = await Promise.all([
      fetch('configuracion.json', { cache: 'no-store' }).then((r) => r.json()),
      fetch('textos.json', { cache: 'no-store' }).then((r) => r.json())
    ]);
    this.datos = configuracion;
    this.textos = textos;
  }

  get config(): Configuracion {
    return this.datos;
  }

  texto(clave: string): string {
    return this.textos[clave] ?? clave;
  }
}
