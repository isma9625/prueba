import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private token: string | null = null;

  constructor() {
    // Al iniciar, intenta cargar el token almacenado en localStorage
    this.token = localStorage.getItem('token');
  }


  // --------------------------------------------------------------------------------------
  // LOGIN EXITOSO
  // --------------------------------------------------------------------------------------

  /**
   * Guarda el token JWT y actualiza el almacenamiento local tras un login exitoso.
   * 
   * @param token El token JWT recibido al autenticar con exito.
   * @param userData Información adicional del usuario (no lo usamos para no mostrar informacion).
   */
  loginSuccess(token: string, userData: any): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // --------------------------------------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------------------------------------
  
  /**
   * Elimina el token JWT del servicio y del almacenamiento local, cerrando la sesión.
   */
  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  
  // --------------------------------------------------------------------------------------
  // VERIFICAR USUARIO AUNTENTICADO
  // --------------------------------------------------------------------------------------
  
   /**
   * Verifica si el usuario está autenticado (es decir, si hay un token válido almacenado).
   * 
   * @returns true si existe un token, false en caso contrario.
   */
  isUserLoggedIn(): boolean {
    return !!this.getToken();
  }

  // --------------------------------------------------------------------------------------
  // OBTENER TOKEN 
  // --------------------------------------------------------------------------------------

  /**
   * Obtiene el token JWT almacenado en localStorage.
   * 
   * @returns El token JWT o null si no existe.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }


  // --------------------------------------------------------------------------------------
  // OBTENER ID DESDE EL TOKEN 
  // --------------------------------------------------------------------------------------
  
  /**
   * Extrae el ID del usuario del token JWT decodificado.
   * 
   * @returns El ID de usuario como número o null si no hay token o no se puede decodificar.
   */
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
       // En JWT  "sub" suele contener el ID del usuario
      return decoded.sub ? Number(decoded.sub) : null;
    } catch (e) {
      return null;
    }
  }


  // --------------------------------------------------------------------------------------
  // OBTENER NOMBRE DESDE EL TOKEN
  // --------------------------------------------------------------------------------------

  /**
   * Extrae el nombre del usuario del token JWT decodificado.
   * 
   * @returns El nombre de usuario o null si no existe o no se puede decodificar.
   */
  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded.name || null; 
    } catch (e) {
      return null;
    }
  }
}
