import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { ReactRenderDirectiveDirective } from './directives/react-render-directive.directive';
import { AuthService } from './services/auth-service.service';
import { ServicioLaravelService } from './services/servicio-laravel.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, ReactRenderDirectiveDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  constructor(
    private authService: AuthService,
    private servicioLaravel: ServicioLaravelService
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.servicioLaravel.obtenerUsuarioActual().subscribe({
        next: (userData) => {
          this.authService.loginSuccess(this.authService.getToken()!, userData);
        },
        error: (err) => {
          console.error('Error obteniendo usuario actual', err);
        }
      });
    }
  }
}