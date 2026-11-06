import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../servicios/productos.service';
import { Producto } from '../../modelos/producto';
import { ConfiguracionService } from '../../../../core/configuracion.service';
import { textoDeError } from '../../../../core/manejo-errores';
import { TextoPipe } from '../../../../shared/pipes/texto.pipe';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [RouterLink, TextoPipe],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent implements OnInit {
  private productosService = inject(ProductosService);
  private configuracion = inject(ConfiguracionService);
  productos: Producto[] = [];
  cargando = true;
  error = '';
  filtro = '';

  ngOnInit(): void {
    this.productosService.listar().subscribe({
      next: (datos) => {
        this.productos = datos;
        this.cargando = false;
      },
      error: (e) => {
        this.error = textoDeError(e, this.configuracion);
        this.cargando = false;
      }
    });
  }

  get filtrados(): Producto[] {
    const texto = this.filtro.trim().toLowerCase();
    if (!texto) return this.productos;
    return this.productos.filter((p) => p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto));
  }

  esStockBajo(p: Producto): boolean {
    return p.stock_actual < p.cantidad_minima;
  }

  alFiltrar(evento: Event): void {
    this.filtro = (evento.target as HTMLInputElement).value;
  }

  get textoBuscar(): string {
    return this.configuracion.texto('inventario.buscar');
  }
}
