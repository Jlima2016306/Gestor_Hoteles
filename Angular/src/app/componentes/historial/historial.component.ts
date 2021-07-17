import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelos/usuario.model';
import {factura} from '../../modelos/factura.model'

import { carrito } from "../../modelos/carritoServicios.model"
import { carritoService } from 'src/app/servicios/carrito.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  providers: [carritoService]
})

export class HistorialComponent implements OnInit {
    public token;
    public identidad;
    public servicio
    public IdHabitacion
    public idHotelenUso
    public NombreHabitacion
    public ReservacionModel

    public HistorialServicio
    public HistorialHoteles

    constructor(
      private _carritoService: carritoService,
      private _router: Router
    ) {

    }
    ngOnInit(): void {


      var Habitacion = localStorage.getItem("Habitacion")

      var HabitacionNombre = (JSON.parse(Habitacion)).Nombre;
      var idHabitacion = (JSON.parse(Habitacion))._id;


      this.IdHabitacion = idHabitacion


      this.NombreHabitacion = HabitacionNombre

      this.HistorialServicios()
      this.mostrarHistorialHoteles()
    }



    refresh(): void { window.location.reload(); }



    HistorialServicios(){
      this._carritoService.HistorialServicios().subscribe(
        response => {
          this.HistorialServicio = response.Historial
          console.log(this.HistorialServicio)
        }

      )

    }

    mostrarHistorialHoteles(){
      this._carritoService.mostrarHistorialHoteles().subscribe(
        response => {
          this.HistorialHoteles = response.Historial
          console.log(this.HistorialHoteles)





        }

      )

    }


    obtenerNada(){}





  }

