import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';
import { AuthService } from './auth-service.service';

const apiUrl = 'https://pokemonbattle.site/api';

@Injectable({
  providedIn: 'root'
})

export class ServicioLaravelService {
  constructor(private _http: HttpClient, private authService: AuthService) { }

  // -----------------------------------------------------------------------------
  // GENERA LOS HEADERS CON JWT PARA LAS PETICIONES AUTORIZADAS
  // -----------------------------------------------------------------------------
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Siempre actualizado
    return new HttpHeaders({
    Authorization: `Bearer ${token}`
    });
  }

  // -----------------------------------------------------------------------------
  // MÉTODO DE INICIO DE SESIÓN
  // -----------------------------------------------------------------------------
  login(credentials: { email: string; password: string }): Observable<any> {
    return this._http.post<any>(`${apiUrl}/authapi/login`, credentials);
  }

  // -----------------------------------------------------------------------------
  // OBTENER TODAS LAS CARTAS CON AUTORIACIÓN
  // -----------------------------------------------------------------------------
  obtenercartas(): Observable<any> {
    return this._http.get<any>(`${apiUrl}/cartasapi`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER LA LISTA DE TIPO DE CARTAS
  // -----------------------------------------------------------------------------
  obtenerTipos(): Observable<any> {
    return this._http.get<any>(`${apiUrl}/tiposapi`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER LISTA DE RAREZA DE CARTAS
  // -----------------------------------------------------------------------------
  obtenerRareza(): Observable<any> {
    return this._http.get<any>(`${apiUrl}/tiposRareza`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER LISTA DE LAS EXPANSIONES
  // -----------------------------------------------------------------------------
  obtenerExpansiones(): Observable<any> {
    return this._http.get<any>(`${apiUrl}/expansionesNombre`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER LOS SOBRES
  // -----------------------------------------------------------------------------
  obtenerSobres(): Observable<any> {
    return this._http.get<any>(`${apiUrl}/packsapi`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // ABRIR SOBRE
  // -----------------------------------------------------------------------------
  abrirSobre(packName: string): Observable<any> {
    return this._http.get<any>(`${apiUrl}/abrirPack/${packName}`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER CARTAS DEL INVENTARIO
  // -----------------------------------------------------------------------------
  obtenercartasInventario(userId: number | null): Observable<any> {
    return this._http.get<any>(`${apiUrl}/cartasInventario/${userId}`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // CREAR LA BARAJA
  // -----------------------------------------------------------------------------
  crearBaraja(data: { name: string; user_id: number }): Observable<any> {
    return this._http.post<any>(`${apiUrl}/crearBarajas`, data, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER LA BARAJA
  // -----------------------------------------------------------------------------
  obtenerBarajas(userId: number | null): Observable<any> {
    return this._http.get<any>(`${apiUrl}/obtenerBarajas/${userId}`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // AGREGAR CARTAS A BARAJA
  // -----------------------------------------------------------------------------
  agregarCartaABaraja(data: { deck_name: string, card_id: string }): Observable<any> {
    return this._http.post<any>(`${apiUrl}/agregarCartaABaraja`, data, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // ELIMINAR CARTA
  // -----------------------------------------------------------------------------
  eliminarCarta(data: { deck_name: string, card_id: string }): Observable<any> {
    return this._http.post<any>(`${apiUrl}/eliminarCarta`, data, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // LISTAR CARTAS DE BARAJA
  // -----------------------------------------------------------------------------
  listarCartasDeBaraja(deckName: string): Observable<any> {
    return this._http.get<any>(`${apiUrl}/listarCartasBaraja/${deckName}`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // ELIMINAR BARAJAS
  // -----------------------------------------------------------------------------
  eliminarBaraja(deckName: number): Observable<any> {
    return this._http.post<any>(`${apiUrl}/eliminarBaraja`, { deck_name: deckName }, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // COMPRAR CARTA
  // -----------------------------------------------------------------------------
  comprarCarta(userId: number, cardId: number, packName: string): Observable<any> {
    const body = { user_id: userId, card_id: cardId, packName };
    return this._http.post<any>(`${apiUrl}/comprarCarta`, body, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // VER CARTAS + PRECIO
  // -----------------------------------------------------------------------------
  verCartasConPrecio(packName: string): Observable<any> { 
    return this._http.get<any>(`${apiUrl}/cartasPackConPrecio/${packName}`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER LOS PUNTOS DEL PACK
  // -----------------------------------------------------------------------------
  obtenerPuntosPack(packName: string, userId: number): Observable<any> {
    return this._http.get<any>(`${apiUrl}/obtenerPuntosPack/${packName}/${userId}`, { headers: this.getAuthHeaders() });
  }

  // -----------------------------------------------------------------------------
  // OBTENER USUARIO ACTUAL
  // -----------------------------------------------------------------------------
  obtenerUsuarioActual(): Observable<any> {
    return this._http.get<any>(`${apiUrl}/me`, { headers: this.getAuthHeaders() });
  }
}

export const registro = async (userData: { name: string; email: string; password: string }) => {
  return await axios.post(`${apiUrl}/registroapi`, userData);
};
