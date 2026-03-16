import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class pokemonGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isUserLoggedIn();
   

    if (isLoggedIn ) {
      this.router.navigate(['/home']);
      return false;
    } else {
      
      return true;
    }
  }
}
