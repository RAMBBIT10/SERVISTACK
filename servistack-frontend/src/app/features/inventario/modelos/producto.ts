export interface Producto {
  id: number;
  nombre: string;
  categoria: string | null;
  codigo: string;
  cantidad_minima: number;
  stock_actual: number;
}
