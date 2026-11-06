import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection, isDevMode, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { AuthClientConfig, provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { ConfiguracionService } from './core/configuracion.service';
import { clienteHttpInterceptor } from './core/cliente-http.interceptor';

function iniciarConfiguracion(configuracion: ConfiguracionService, auth: AuthClientConfig) {
  return async () => {
    await configuracion.cargar();
    const { dominio, clientId, audiencia } = configuracion.config.auth0;
    auth.set({
      domain: dominio,
      clientId,
      authorizationParams: { redirect_uri: window.location.origin, audience: audiencia }
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([clienteHttpInterceptor])),
    provideAuth0(),
    {
      provide: APP_INITIALIZER,
      useFactory: iniciarConfiguracion,
      deps: [ConfiguracionService, AuthClientConfig],
      multi: true
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
