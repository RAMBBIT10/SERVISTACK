import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap, take } from 'rxjs';
import { ConfiguracionService } from './configuracion.service';

export const clienteHttpInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const apiUrl = inject(ConfiguracionService).config.apiUrl;
  if (!peticion.url.startsWith(apiUrl)) {
    return siguiente(peticion);
  }
  const auth = inject(AuthService);
  return auth.getAccessTokenSilently().pipe(
    take(1),
    switchMap((token) => siguiente(peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
  );
};
