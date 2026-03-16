import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  userName: string | null = '';

  constructor(public authService: AuthService, private router: Router) {
    this.userName = this.authService.getUserName();
  }

  isSidebarOpen = false;

  // --------------------------------------------------------------------------------------
  // CERRAR SESION
  // --------------------------------------------------------------------------------------

  logout() {
    this.authService.logout();  // Cierra la sesión del usuario
    this.router.navigate(['/login']); // Redirige a la página de login
  }

  get isLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();  
  }
}
