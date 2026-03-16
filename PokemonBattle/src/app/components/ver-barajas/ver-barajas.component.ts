import { Component } from '@angular/core';
import { ServicioLaravelService } from '../../services/servicio-laravel.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-ver-barajas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ver-barajas.component.html',
  styleUrls: ['./ver-barajas.component.css']
})
export class VerBarajasComponent {

  //VARIABLES
  cartas: any[] = [];
  cartasFiltradas: any[] = [];
  errors: string = '';
  message: string = '';
  nombreBaraja: string = '';
  barajas: any = [];
  totalBarajas: number = 0;
  userId : number |null = 0; //atributo que lo cargas en ngOnInit y lo llamas en diversos metodos de esta clase
  contactForm: FormGroup;
  mostrar: boolean = false;
  cartasEnBaraja: any[] = [];
  huecos: number[] = Array.from({ length: 10 }, (_, i) => i);
  barajaSeleccionada: any = null;
  ocultarBarajas: boolean = false;
  vista: 'mostrarBarajas' | 'mostrarFormulario' | 'detalleBarajas' = 'mostrarBarajas'; // Variable que indica la vista actual que se debe mostrar en el componente.

  constructor(private fb: FormBuilder, private servicio: ServicioLaravelService, private authService: AuthService) {
    this.contactForm = this.fb.group({
      name: ['',
        [
          Validators.required,
          Validators.maxLength(30),
        ]
      ],
    });
  }

  /**
   * 
   *
   * - Obtiene el ID del usuario autenticado a través del authService.
   * - Si existe un usuario logueado, realiza la llamada para obtener las cartas del inventario de ese usuario.
   * - Al recibir los datos, actualiza las cartas  y la cantidad total de barajas.
   * - Finalmente, llama a obtenerBarajas() para cargar las barajas del usuario.
   */
  ngOnInit(): void {
    this.userId = this.authService.getUserId(); //llamada para saber el id del usuario
    
    if (this.userId) {
      this.servicio.obtenercartasInventario(this.userId).subscribe(data => {
        this.cartas = data;
        this.cartasFiltradas = data;
        this.totalBarajas = this.barajas.length;
      });
      this.obtenerBarajas();
    }
  }


  // --------------------------------------------------------------------------------------
  // CREAR BARAJA
  // --------------------------------------------------------------------------------------

  /**
 * Crea una nueva baraja para el usuario actual.
 *
 * - Reinicia mensajes de error y éxito.
 * - Verifica que exista un usuario en sesión.
 * - Prepara un objeto con el nombre de la baraja y el ID del usuario.
 * - Llama al servicio para crear la baraja en el backend.
 * - Al obtener respuesta exitosa:
 *   - Guarda la baraja creada.
 *   - Recarga la lista de barajas.
 *   - Cambia la vista para mostrar detalle de la baraja.
 *   - Resetea el formulario.
 *   - Verifica que la baraja tenga 10 cartas, si no, muestra error.
 * 
 *
 * @returns void
 */
  crearBaraja(): void {
    this.errors = '';
    this.message = '';
      
    if (!this.userId) {
      this.errors = 'No se ha encontrado el usuario en la sesión';
      return;
    }

    this.cartasEnBaraja = [];

    if (this.userId) {
      const nuevaBaraja = {
        name: this.contactForm.value.name,
        user_id: Number(this.userId)
      };

      this.servicio.crearBaraja(nuevaBaraja).subscribe({
        next: (data) => {
          this.barajaSeleccionada = data;
          this.obtenerBarajas();

          this.vista = 'detalleBarajas';

          this.contactForm.reset();

          this.vista = 'detalleBarajas'; // Mostrar la vista con huecos y cartas
          this.barajaSeleccionada = data; // Guardar la baraja creada

          if (!this.BarajaCompleta()) {
            this.errors = "Debes completar la baraja con 10 cartas antes de poder guardar.";
            return;
          }
        },
        error: (err) => {
          this.errors = "Error al crear la baraja";
        }
      });
    }
  }


  // --------------------------------------------------------------------------------------
  // OBTENER BARAJAS
  // --------------------------------------------------------------------------------------

  /**
 * Obtiene las barajas del usuario actual desde el backend.
 *
 * - Limpia mensajes previos
 * - Realiza la llamada al servicio para obtener las barajas usando el userId.
 * - Al recibir la respuesta, asigna las barajas 
 * - En caso de error, actualiza el mensaje de error 
 *
 * @returns void
 */
  obtenerBarajas(): void {
    this.errors = '';  
    this.message = '';
    this.servicio.obtenerBarajas(this.userId).subscribe({
      next: (barajas) => {
        this.barajas = barajas; // Guarda las barajas recibidas
      },
      error: (err) => {
        this.errors = "Error al obtener las barajas";
        
      }
    });
  }

  

  // --------------------------------------------------------------------------------------
  // AGREGAR CARTA
  // --------------------------------------------------------------------------------------

  /**
 * Agrega una carta a la baraja seleccionada
 *
 * Validaciones:
 * - Verifica que exista una baraja seleccionada o un nombre de baraja en el formulario.
 * - Limita la baraja a un máximo de 10 cartas.
 * - Permite un máximo de 2 cartas iguales en la baraja.
 *
 * Luego realiza la llamada al servicio para agregar la carta y actualiza .
 *
 * @param carta Objeto que representa la carta a agregar (debe contener al menos la propiedad card_id).
 *
 * @returns void
 */
  agregarCartaACartaSeleccionada(carta: any): void {
    this.errors = '';
    this.message = '';
    const deckName = this.barajaSeleccionada ? this.barajaSeleccionada.name : this.contactForm.value.name;

    if (!deckName) {
      this.errors = "No hay baraja seleccionada";
      return;
    }

    if (this.cartasEnBaraja.length >= 10) {
      this.errors = "Ya has alcanzado el límite de 10 cartas en la baraja";
      return;
    }

    const cantidadIguales = this.cartasEnBaraja.filter(c => c.card_id === carta.card_id).length;

    if (cantidadIguales >= 2) {
      this.errors = "No puedes agregar más de dos cartas iguales a la baraja";
      return;
    }

    const data = {
      deck_name: deckName,
      card_id: carta.card_id
    };

    this.servicio.agregarCartaABaraja(data).subscribe({
      next: (res) => {
        
        this.cartasEnBaraja.push(carta); // actualiza el array para mostrar la carta
        this.actualizarConteoCartas();
      },
      error: (err) => {
        this.errors = err.error?.error || "Error al añadir carta";
      }
    });
  }


  // --------------------------------------------------------------------------------------
  // ELIMINAR CARTA DE BARAJA
  // --------------------------------------------------------------------------------------

  /**
 * Elimina una carta de la baraja seleccionada o de la baraja en creación.
 *
 * - Verifica que exista una baraja seleccionada o un nombre de baraja en el formulario.
 * - Envía la petición al servicio para eliminar la carta del backend.
 * - Si la eliminación es exitosa, elimina la carta.
 * - Maneja errores mostrando mensajes apropiados.
 *
 * @param carta Objeto que representa la carta a eliminar (debe contener al menos la propiedad `card_id`).
 *
 * @returns void
 */
  eliminarCartaDeBaraja(carta: any): void {
    this.errors = '';
    this.message = '';
    const deckName = this.barajaSeleccionada ? this.barajaSeleccionada.name : this.contactForm.value.name;

    if (!deckName) {
      this.errors = "No hay baraja seleccionada";
      return;
    }

    const data = {
      deck_name: deckName,
      card_id: carta.card_id
    };
    
    this.servicio.eliminarCarta(data).subscribe({
      next: (res) => {
        // Busca en quE posición esta la carta que quieres eliminar
        const posicion = this.cartasEnBaraja.indexOf(carta);

        // Si la carta está en la lista (posicion es diferente de -1)
        if (posicion !== -1) {
          // Quita esa carta de la lista
          this.cartasEnBaraja.splice(posicion, 1);
        }
      },
      error: (err) => {
        
        this.errors = err.error?.error || "Error al eliminar carta";
      }
    });
  }


  // --------------------------------------------------------------------------------------
  // LISTAR CARTAS DE BARAJA
  // --------------------------------------------------------------------------------------

  /**
 * Carga y lista las cartas asociadas a una baraja .
 *
 * - Limpia mensajes.
 * - Asigna la baraja seleccionada.
 * - Inicializa el arreglo  de cartas.
 * - Llama al servicio para obtener las cartas de la baraja por su nombre.
 * - Actualiza el arreglo con las cartas recibidas y cambia la vista a detalle.
 *
 * @param baraja Objeto que representa la baraja seleccionada (debe contener al menos la propiedad `name`).
 *
 * @returns void
 */
  listarCartasBaraja(baraja: any) {
    this.errors = '';
    this.message = '';
    // Verifica si el nombre de la baraja está correcto
    this.barajaSeleccionada = baraja;  // Asignamos la baraja seleccionada
    this.cartasEnBaraja = [];
    this.servicio.listarCartasDeBaraja(baraja.name).subscribe((cartas) => {
      this.cartasEnBaraja = cartas;  // Guardamos las cartas de esa baraja
      this.vista = 'detalleBarajas';
    });
  }


  // --------------------------------------------------------------------------------------
  // ELIMINAR BARAJA
  // --------------------------------------------------------------------------------------

  /**
 * Elimina una baraja por su nombre.
 *
 * - Limpia mensajes previos.
 * - Llama al servicio para eliminar la baraja usando su nombre.
 * - Al eliminar con éxito, actualiza la lista de barajas del usuario.
 * - Maneja errores mostrando un mensaje en caso de fallo.
 *
 * @param baraja Objeto que representa la baraja a eliminar (debe contener al menos la propiedad `name`).
 *
 * @returns void
 */
  eliminarBaraja(baraja: any): void {
    this.errors = '';
    this.message = '';
    this.servicio.eliminarBaraja(baraja.name).subscribe({
      next: (res) => {
        if (this.userId) {
          this.obtenerBarajas(); // actualiza la lista de barajas
        }
      },
      error: (err) => {
        this.errors = 'Error al eliminar la baraja';
      }
    });
  }

  actualizarConteoCartas() {
    this.cartasEnBaraja.length;
  }


  // --------------------------------------------------------------------------------------
  // GUARDAR BARAJA
  // --------------------------------------------------------------------------------------

  /**
 * Guarda la baraja si está completa (tiene 10 cartas).
 *
 * - Verifica si la baraja está completa con el método `BarajaCompleta()`.
 * - Si está completa, limpia los datos y vuelve a la vista de mostrar barajas.
 * - Si no está completa, muestra un mensaje de error indicando la condición.
 */
  guardarBaraja(): void {
    
    if (this.BarajaCompleta()) {
      this.vista = 'mostrarBarajas';
      this.barajaSeleccionada = null;
      this.cartasEnBaraja = [];
      this.errors = '';
      this.message = '';
      this.contactForm.reset();
      this.obtenerBarajas()
    } else {
      this.errors = "La baraja debe tener exactamente 10 cartas para volver a la vista anterior.";
    }
  }


  // --------------------------------------------------------------------------------------
  // BARAJA COMPLETA
  // --------------------------------------------------------------------------------------

  /**
 * Verifica si la baraja tiene exactamente 10 cartas.
 *
 * @returns {boolean} `true` si la cantidad de cartas en la baraja es 10, `false` en caso contrario.
 */
  BarajaCompleta(): boolean {
    return this.cartasEnBaraja.length === 10;
  }

  // --------------------------------------------------------------------------------------
  // CANCELAR CREACION O EDICION DE BARAJA
  // --------------------------------------------------------------------------------------
  
  /**
 * Cancela la edición o creación de una baraja.
 *
 * - Si hay una baraja seleccionada y no está completa (menos de 10 cartas),
 *   se elimina esa baraja llamando al servicio correspondiente.
 * - Independientemente de si se eliminó o no la baraja, se restablece el estado
 *   del componente, limpiando variables, errores, mensajes y formulario.
 *
 * @returns void
 */
  cancelarBaraja(): void {
    if (this.barajaSeleccionada && !this.BarajaCompleta()) {
      // Eliminar la baraja si no está completa
      this.servicio.eliminarBaraja(this.barajaSeleccionada.name).subscribe({
        next: (res) => {
            this.obtenerBarajas();
        },
        error: (err) => {
          this.errors = 'Error al cancelar la baraja';
          console.error(err);
        }
      });
    }

    // Restablecer el estado
    this.vista = 'mostrarBarajas';
    this.barajaSeleccionada = null;
    this.cartasEnBaraja = [];
    this.errors = '';
    this.message = '';
    this.contactForm.reset();
  }
}
