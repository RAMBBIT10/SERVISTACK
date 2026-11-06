import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfiguracionService } from '../../../core/configuracion.service';
import { Producto } from '../modelos/producto';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private http = inject(HttpClient);
  private configuracion = inject(ConfiguracionService);

  private get base(): string {
    return `${this.configuracion.config.apiUrl}/productos`;
  }

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  listarStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/stock-bajo`);
  }

  consultar(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  urlQr(id: number): string {
    return `${this.base}/${id}/qr`;
  }
}
