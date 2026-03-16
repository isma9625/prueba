import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InstruccionesComponent } from './components/instrucciones/instrucciones.component';
import { CartasComponent } from './components/cartas/cartas.component';
import { SobresComponent } from './components/sobres/sobres.component';
import { RegistroComponentComponent } from './components/registro-component/registro-component.component';
import { LoginComponent } from './components/login/login.component';
import { pokemonGuard } from './guards/pokemon.guard';
import { InventarioComponent } from './components/inventario/inventario.component';
import { VerBarajasComponent } from './components/ver-barajas/ver-barajas.component';
import { notLoginGuard } from './guards/not-login.guard';

export const routes: Routes = [
     {
          path:'',
          component: HomeComponent
     },
     {
          path:'home',
          component: HomeComponent
     },
     {
          path:'instrucciones',
          component: InstruccionesComponent
     },
     {
          path:'cartasExistentes',
          component: CartasComponent
     },
     {
          path:'login',
          component: LoginComponent, canActivate: [pokemonGuard]
     }, 
     {
          path:'homeLogueado',
          component: SobresComponent
     },
     {
          path:'registro',
          component: RegistroComponentComponent, canActivate: [pokemonGuard]
     },
     {
          path:'inventario',
          component: InventarioComponent, canActivate: [notLoginGuard]
     },
     {
          path:'sobres',
          component: SobresComponent, canActivate: [notLoginGuard]
     },
     {
          path:'barajas',
          component: VerBarajasComponent, canActivate: [notLoginGuard]
     },
];
