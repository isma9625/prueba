import { Component } from '@angular/core';
import { ServicioLaravelService } from '../../services/servicio-laravel.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-sobres',
  standalone: true,
  imports: [],
  templateUrl: './sobres.component.html',
  styleUrl: './sobres.component.css'
})
export class SobresComponent {

  //variables
  packs: any[]= [];
  cartasSobre: any[]= [];
  mostrarCartasObtenidas: boolean = false;
  mostrarCartasParaComprar: boolean = false;
  packPointsDisplay: string = '';
  packPoints: number = 0;
  mensajeError: string = '';
  mensajesCompra: { [cardId: number]: string } = {};

  groupedPacks: any[][] = []; 

  constructor(private servicio: ServicioLaravelService, private authServicio: AuthService) {}



  /**
 *  Se ejecuta al inicializar el componente.
 * 
 * Comportamiento:
 * - Verifica si el usuario está logueado pero no tiene cargado su ID, 
 *   y en ese caso obtiene los datos del usuario actual desde el backend.
 * - Carga la lista de sobres (packs) disponibles y los agrupa para mostrarlos en el carrousel.
 * 
 * @returns void
 */
  ngOnInit(): void {
    if (this.authServicio.isUserLoggedIn() && !this.authServicio.getUserId()) {
      this.servicio.obtenerUsuarioActual().subscribe({
        next: (userData) => {
          this.authServicio.loginSuccess(this.authServicio.getToken()!, userData);         
        },
        error: (err) => {
        }
      });
    }

    this.servicio.obtenerSobres().subscribe(data => {
      this.packs = data;
      this.groupedPacks = this.agruparPacks(this.packs, 1);
    });
  }


  // --------------------------------------------------------------------------------------
  // ABRIR SOBRE
  // --------------------------------------------------------------------------------------

  /**
 * Abre un sobre  para el usuario y obtiene las cartas correspondientes.
 *
 * @param {string} packName - El nombre del sobre  que se desea abrir.
 * 
 * Comportamiento:
 * - Verifica si el usuario está autenticado y obtiene su ID.
 * - Solicita al backend abrir el sobre indicado.
 * - Actualiza las cartas obtenidas para mostrarlas.
 * - Consulta y muestra los puntos acumulados del usuario para ese sobre.
 * - Maneja errores mostrando mensajes.
 */
  abrirSobre(packName: string) {
    this.mensajeError = '';
    const userId = this.authServicio.getUserId();
    if (!this.authServicio.isUserLoggedIn() || !userId) {
      return;
    }

    this.servicio.abrirSobre(packName).subscribe({
      next: data => {
        this.cartasSobre = data.cartas;

        // Mostrar las cartas obtenidas para compra y ocultar otras vistas relacionadas
        this.mostrarCartasParaComprar = true;
        this.mostrarCartasObtenidas = false;

        this.servicio.obtenerPuntosPack(packName, userId).subscribe(
          puntosData => {
            this.packPointsDisplay = `${puntosData.packPoints} / 5000`;
          },
          error => {
            this.packPointsDisplay = '';
          }
        );
      },
      error: err => {
        this.mensajeError = err.error?.error;
      }
    });
  }


  // --------------------------------------------------------------------------------------
  // VER CARTAS
  // --------------------------------------------------------------------------------------

  /**
 * Muestra las cartas disponibles en un pack con sus precios y puntos  del usuario.
 *
 * @param {string} packName - Nombre del pack cuyas cartas se quieren visualizar.
 * 
 * 
 * - Verifica si hay un usuario logueado.
 * - Obtiene las cartas del pack con sus precios desde el backend.
 * - Actualiza la vista para mostrar las cartas obtenidas y ocultar otras.
 * - Obtiene y muestra los puntos del usuario para ese pack.
 * - Maneja errores mostrando mensajes adecuados.
 */
  verCartas(packName: string) {
    this.mensajeError = '';
    const userId = this.authServicio.getUserId();
    
    if (!userId) {
      this.mensajeError = 'No hay usuario logueado';
      return;
    }

    this.servicio.verCartasConPrecio(packName).subscribe(
      (data) => {
        this.cartasSobre = data;
        this.mostrarCartasObtenidas = true;
        this.mostrarCartasParaComprar = false;

        this.servicio.obtenerPuntosPack(packName, userId).subscribe(
          puntosData => {
            this.packPoints = puntosData.packPoints; 
            this.packPointsDisplay = `${puntosData.packPoints} / 5000`;
          },
          error => {
            this.packPoints = 0;
            this.packPointsDisplay = '';
          }
        );
      },
      (error) => {
        this.mensajeError = 'Error al obtener las cartas';
      }
    );
  }


  // --------------------------------------------------------------------------------------
  // COMPRAR CARTAS
  // --------------------------------------------------------------------------------------

  /**
 * Realiza la compra de una carta específica del pack mostrado.
 * @param {number} cardId - ID de la carta que se comprara.
 */
  comprarCarta(cardId: number) {
    this.mensajeError = '';
    const userId = this.authServicio.getUserId();
    const packName = this.cartasSobre[0]?.packName || '';

     // Valida que exista usuario logueado y pack seleccionado
    if (!userId || !packName) {
      this.mensajeError = 'Faltan datos para realizar la compra';
      return;
    }

    this.servicio.comprarCarta(Number(userId), cardId, packName).subscribe({
      next: (res) => {
        this.mensajesCompra[cardId] = res.success;
        // Actualizar puntos mostrados
        this.servicio.obtenerPuntosPack(packName, userId).subscribe(
          puntosData => {
            this.packPoints = puntosData.packPoints;
            this.packPointsDisplay = `${puntosData.packPoints} / 5000`;
          }
        );
      },
      error: (err) => {
        this.mensajeError = err.error?.error || 'Error al comprar la carta';
        console.error('Error al comprar:', err);
      }
    });
  }

  // --------------------------------------------------------------------------------------
  // VOLVER A INICIO VISTA
  // --------------------------------------------------------------------------------------
  volver() {
    this.mensajeError = '';
    this.mostrarCartasObtenidas = false;
    this.mostrarCartasParaComprar = false;
    this.cartasSobre = [];
    this.mensajeError = '';
  }


  // --------------------------------------------------------------------------------------
  // AGRUPAR PACKS
  // --------------------------------------------------------------------------------------

  //Función para agrupar los sobres en arrays de tamaño "grupo"
  agruparPacks(packs: any[], grupo: number): any[][] {
    const resultado = [];
    for (let i = 0; i < packs.length; i += grupo) {
      resultado.push(packs.slice(i, i + grupo));
    }
    return resultado;
  }
}
