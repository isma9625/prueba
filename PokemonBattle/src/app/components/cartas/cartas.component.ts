import { Component } from '@angular/core';
import { ServicioLaravelService } from '../../services/servicio-laravel.service';

@Component({
  selector: 'app-cartas',
  standalone: true,
  imports: [],
  templateUrl: './cartas.component.html',
  styleUrl: './cartas.component.css'
})
export class CartasComponent {
  cartas: any[] = [];
  cartasFiltradas: any[] = [];
  tipos: string[] = [];
  rareza: number[] = [];
  expansiones: string[] = [];

  /**
   * Constructor que inyecta el servicio para manejar las llamadas a Laravel.
   * @param {ServicioLaravelService} servicio Servicio para conectar la API Laravel.
  */
  constructor(private servicio: ServicioLaravelService) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Se encarga de cargar datos iniciales como cartas, tipos, rarezas y expansiones.
  */
  ngOnInit(): void {
    this.servicio.obtenercartas().subscribe(data => {
      this.cartas = data;
      this.cartasFiltradas = data;
    });

    this.servicio.obtenerTipos().subscribe(data => {
      this.tipos = data;
    });

    this.servicio.obtenerRareza().subscribe(data => {
      this.rareza = data;
    });

    this.servicio.obtenerExpansiones().subscribe(data => {
      this.expansiones = data;
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
