import { HttpErrorResponse } from '@angular/common/http';
import { ConfiguracionService } from './configuracion.service';
import { textoDeError } from './manejo-errores';

describe('textoDeError', () => {
  const configuracionFalsa = {
    texto: (clave: string) => `texto:${clave}`,
  } as unknown as ConfiguracionService;

  it('devuelve el texto de sin conexion cuando el estado es 0', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(textoDeError(error, configuracionFalsa)).toBe('texto:error.sinConexion');
  });

  it('devuelve el mensaje que manda el backend', () => {
    const error = new HttpErrorResponse({ status: 404, error: { error: 'Producto no encontrado' } });
    expect(textoDeError(error, configuracionFalsa)).toBe('Producto no encontrado');
  });

  it('devuelve el texto generico si el backend no manda mensaje', () => {
    const error = new HttpErrorResponse({ status: 500, error: {} });
    expect(textoDeError(error, configuracionFalsa)).toBe('texto:error.generico');
  });

  it('devuelve el texto generico si el error no es una respuesta http', () => {
    expect(textoDeError(new Error('algo'), configuracionFalsa)).toBe('texto:error.generico');
  });
});
