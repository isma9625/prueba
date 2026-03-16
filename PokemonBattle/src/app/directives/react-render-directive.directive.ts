/*
Esta directiva sirve para renderizar los componentes de react y asi pueda entenderlos angular
*/

import { Directive, Input, ElementRef, SimpleChanges, OnChanges} from '@angular/core';
import { renderizarRegistro } from '../components/registroReact/renderizar';


@Directive({
  selector: '[appReactRenderDirective]',
  standalone: true
})
export class ReactRenderDirectiveDirective implements OnChanges {
  @Input() componentType:string = '';

  constructor(private el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['componentType'] && this.componentType === 'registro') {
      console.log('ComponentType cambia a registro');
      renderizarRegistro(this.el.nativeElement); 
    }
  }
}
