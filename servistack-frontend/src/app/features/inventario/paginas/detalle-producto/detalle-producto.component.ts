import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductosService } from '../../servicios/productos.service';
import { Producto } from '../../modelos/producto';
import { ConfiguracionService } from '../../../../core/configuracion.service';
import { textoDeError } from '../../../../core/manejo-errores';
import { TextoPipe } from '../../../../shared/pipes/texto.pipe';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [RouterLink, TextoPipe],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent implements OnInit {
  private ruta = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private configuracion = inject(ConfiguracionService);
  producto: Producto | null = null;
  error = '';

  ngOnInit(): void {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    this.productosService.consultar(id).subscribe({
      next: (p) => (this.producto = p),
      error: (e) => (this.error = textoDeError(e, this.configuracion))
    });
  }
}
