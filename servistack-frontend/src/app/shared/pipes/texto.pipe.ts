import { Pipe, PipeTransform, inject } from '@angular/core';
import { ConfiguracionService } from '../../core/configuracion.service';

@Pipe({ name: 'texto', standalone: true })
export class TextoPipe implements PipeTransform {
  private configuracion = inject(ConfiguracionService);

  transform(clave: string): string {
    return this.configuracion.texto(clave);
  }
}
