import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class notLoginGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
