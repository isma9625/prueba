// registro-component.component.ts
import { Component } from '@angular/core';
// registro-component.component.ts
import { ReactRenderDirectiveDirective } from '../../directives/react-render-directive.directive'; 

/**
 * Este componente sirve como contenedor para que angular pueda usar el componente de react
 */

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactRenderDirectiveDirective],
  templateUrl: './registro-component.component.html',  // Usa la plantilla de HTML correctamente
  styleUrls: ['./registro-component.component.css']
})
export class RegistroComponentComponent {
  constructor() {
    console.log('RegistroComponentComponent cargado');
  }
}
