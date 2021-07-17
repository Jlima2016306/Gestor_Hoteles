import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { HabitacionesComponent } from './componentes/habitaciones/habitaciones.component'
import { ReservacionComponent } from './componentes/reservacion/reservacion.component'
import { CarritoComponent} from './componentes/carrito/carrito.component'
import { HistorialComponent} from './componentes/historial/historial.component'
import {GraficasComponent } from  "./componentes/graficas/graficas.component";
import { FacturasComponent } from './componentes/facturas/facturas.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'usuarios', component: UsuariosComponent },

  { path: "inicio", component: InicioComponent},
  { path: "habitaciones", component:HabitacionesComponent },
  { path: "reservacion", component: ReservacionComponent},
  { path: "carrito", component: CarritoComponent},
  { path: "historial", component: HistorialComponent},
  { path: "graficas", component: GraficasComponent},
  { path: "facturas", component: FacturasComponent}
,
  { path: '**', component: LoginComponent }
  // { path: '**', redictTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
