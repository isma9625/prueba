import { Component } from '@angular/core';
import { ServicioLaravelService } from '../../services/servicio-laravel.service';
import { AuthService } from '../../services/auth-service.service';


@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent {
  cartas: any[] = [];
  cartasFiltradas: any[] = [];
  tipos: string[] = [];
  rareza: number[] = [];
  expansiones: string[] = [];
  message: string = '';
  errors: string = '';
  message2: string = '';


  constructor(private servicio: ServicioLaravelService, private authService: AuthService) {}

   ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      //Si hay un usuario logueado obtiene sus cartas llamando al servicio
      this.servicio.obtenercartasInventario(userId).subscribe({
        next: data => {
          this.cartas = data;
          this.cartasFiltradas = data;
          if (this.cartas.length === 0) {
            this.message = "No tienes cartas en tu inventario.";
            this.message2 = "Abre un sobre para obtener cartas"
          } else {
            this.message = '';
          }
          
        },
        error: err => {
          this.errors = err.error?.error || "Error al cargar el inventario.";
        }
      });
    } else {
      this.errors = "No se pudo identificar el usuario.";
    }

    // Obtener tipos
    this.servicio.obtenerTipos().subscribe({
      next: data => this.tipos = data,
      error: err => console.error("Error al obtener tipos:", err)
    });

    // Obtener rarezas 
    this.servicio.obtenerRareza().subscribe({
      next: data => this.rareza = data,
      error: err => console.error("Error al obtener rarezas:", err)
    });

    // Obtener expansiones existentes
    this.servicio.obtenerExpansiones().subscribe({
      next: data => this.expansiones = data,
      error: err => console.error("Error al obtener expansiones:", err)
    });
  }

  /**
   * Filtra las cartas según el texto ingresado en el input.
   * @param event Evento del input que contiene el texto para filtrar.
  */
  filtrarCartas(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.cartasFiltradas = this.cartas.filter(carta =>
      carta.name.toLowerCase().includes(valor)
    );
  }

  /**
   * Filtra las cartas por el nombre de la expansión.
   * @param expansion_name Nombre de la expansión a filtrar.
  */
  filtrarExpansion(expansion_name: string): void {
    this.cartasFiltradas = this.cartas.filter(carta =>
      carta.expansion_name.toLowerCase() === expansion_name.toLowerCase()
    );
   
  }

  /**
   * Filtra las cartas por tipo.
   * @param type Tipo de carta a filtrar.
  */
  filtrarTipo(type: string): void {
    this.cartasFiltradas = this.cartas.filter(carta =>
      carta.type.toLowerCase() === type.toLowerCase()
    );
    
  }

  /**
   * Filtra las cartas por rareza.
   * @param rarity Nivel de rareza a filtrar.
  */
  filtrarRareza(rarity: number): void {
    this.cartasFiltradas = this.cartas.filter(carta =>
      carta.rarity === rarity
    );
    
  }

   /**
   * Filtra las cartas cuyo nombre termina con " ex".
  */
  filtrarEx(): void {
    this.cartasFiltradas = this.cartas.filter(carta =>
      carta.name.toLowerCase().endsWith(' ex')
    );
  }

   /**
   * Muestra todas las cartas sin ningún filtro aplicado.
  */
  verTodas(): void {
    this.cartasFiltradas = this.cartas;
  }




} 
