import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MiComponenteComponent } from './mi-componente/mi-componente.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { HabitacionesComponent } from './componentes/habitaciones/habitaciones.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { NgbModule,NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ReservacionComponent } from './componentes/reservacion/reservacion.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { HistorialComponent } from './componentes/historial/historial.component';
import { GraficasComponent } from './componentes/graficas/graficas.component';

import { ChartsModule } from 'ng2-charts';
import { FacturasComponent } from './componentes/facturas/facturas.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    NavbarComponent,
    UsuariosComponent,

    MiComponenteComponent,
    InicioComponent,
    HabitacionesComponent,
    ReservacionComponent,
    CarritoComponent,
    HistorialComponent,

    GraficasComponent,
    FacturasComponent
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,

    ChartsModule,

    NgbModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
