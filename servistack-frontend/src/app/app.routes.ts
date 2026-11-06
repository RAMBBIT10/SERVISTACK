import { Routes } from '@angular/router';
import { guardAutenticacion } from './core/guard-autenticacion';
import { InicioSesionComponent } from './features/autenticacion/paginas/inicio-sesion.component';
import { ListaProductosComponent } from './features/inventario/paginas/lista-productos/lista-productos.component';
import { DetalleProductoComponent } from './features/inventario/paginas/detalle-producto/detalle-producto.component';
import { EscanearQrComponent } from './features/inventario/paginas/escanear-qr/escanear-qr.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'productos' },
  { path: 'entrar', component: InicioSesionComponent },
  { path: 'productos', component: ListaProductosComponent, canActivate: [guardAutenticacion] },
  { path: 'productos/:id', component: DetalleProductoComponent, canActivate: [guardAutenticacion] },
  { path: 'escanear', component: EscanearQrComponent, canActivate: [guardAutenticacion] },
  { path: '**', redirectTo: 'productos' }
];
