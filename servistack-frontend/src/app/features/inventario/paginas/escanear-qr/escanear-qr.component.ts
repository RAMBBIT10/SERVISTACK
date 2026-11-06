import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Html5Qrcode } from 'html5-qrcode';
import { ProductosService } from '../../servicios/productos.service';
import { ConfiguracionService } from '../../../../core/configuracion.service';
import { textoDeError } from '../../../../core/manejo-errores';
import { TextoPipe } from '../../../../shared/pipes/texto.pipe';

@Component({
  selector: 'app-escanear-qr',
  standalone: true,
  imports: [TextoPipe],
  templateUrl: './escanear-qr.component.html',
  styleUrl: './escanear-qr.component.css'
})
export class EscanearQrComponent implements OnDestroy {
  private router = inject(Router);
  private productosService = inject(ProductosService);
  private configuracion = inject(ConfiguracionService);
  private lector: Html5Qrcode | null = null;
  readonly idVisor = 'visor-qr';
  escaneando = false;
  error = '';

  async iniciar(): Promise<void> {
    this.error = '';
    const camara = this.configuracion.config.camara;
    this.lector = new Html5Qrcode(this.idVisor);
    try {
      await this.lector.start({ facingMode: camara.lado }, { fps: camara.fps, qrbox: camara.lado_visor }, (texto) => this.alLeer(texto), () => {});
      this.escaneando = true;
    } catch {
      this.error = this.configuracion.texto('qr.errorCamara');
    }
  }

  private async alLeer(codigo: string): Promise<void> {
    await this.detener();
    this.productosService.listar().subscribe({
      next: (productos) => {
        const encontrado = productos.find((p) => p.codigo === codigo);
        if (encontrado) this.router.navigate(['/productos', encontrado.id]);
        else this.error = this.configuracion.texto('qr.noEncontrado');
      },
      error: (e) => (this.error = textoDeError(e, this.configuracion))
    });
  }

  async detener(): Promise<void> {
    if (this.lector && this.escaneando) {
      await this.lector.stop();
      this.escaneando = false;
    }
  }

  ngOnDestroy(): void {
    this.detener();
  }
}
