import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServicioLaravelService } from '../../services/servicio-laravel.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  contactForm: FormGroup;
  errors: string = '';
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private servicioLaravel: ServicioLaravelService,
    private authService: AuthService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  
  // --------------------------------------------------------------------------------------
  // ENVIAR FORMULARIO
  // --------------------------------------------------------------------------------------

  /**
 * Ejecuta el proceso de login al enviar el formulario.
 * - Valida el formulario.
 * - Envía los datos de login al backend.
 * - Si el login es exitoso, guarda el token y obtiene los datos del usuario actual.
 * - Redirige al usuario a la página principal.
 * - Muestra mensajes de error en caso de fallo.
 */
  onSubmit() {
    if (this.contactForm.valid) {
      this.servicioLaravel.login(this.contactForm.value).subscribe({
        next: (response) => {
          if (response.success && response.token) {
            this.message = "Login satisfactorio";
            localStorage.setItem('token', response.token);

            this.servicioLaravel.obtenerUsuarioActual().subscribe({
              next: (userData) => {

                this.authService.loginSuccess(response.token, userData);

                this.router.navigate(['/home']);
              },
              error: (err) => {
                this.errors = 'Error obteniendo usuario actual';
              }
            });
          } else {
            this.errors = "Credenciales incorrectas";
          }
        },
        error: (e) => {
          console.log(e);
          if (e.status === 401) {
            this.errors = "Credenciales incorrectas";
          } else {
            this.errors = "Problemas con el servidor";
          }
        }
      });
    }
  }
}
