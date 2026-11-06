import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { TextoPipe } from '../../../shared/pipes/texto.pipe';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [TextoPipe],
  template: `
    <section class="caja">
      <h1>{{ 'app.nombre' | texto }}</h1>
      <p>{{ 'app.subtitulo' | texto }}</p>
      <button (click)="entrar()">{{ 'sesion.iniciar' | texto }}</button>
    </section>
  `,
  styles: [`.caja { max-width: 360px; margin: 80px auto; text-align: center; }`]
})
export class InicioSesionComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.auth.isAuthenticated$.subscribe((ok) => {
      if (ok) this.router.navigate(['/productos']);
    });
  }

  entrar(): void {
    this.auth.loginWithRedirect({ appState: { target: '/productos' } });
  }
}
