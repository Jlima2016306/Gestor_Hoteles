import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelos/usuario.model';
import {factura} from '../../modelos/factura.model'

import { carrito } from "../../modelos/carritoServicios.model"
import { carritoService } from 'src/app/servicios/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  providers: [carritoService],
})
export class CarritoComponent implements OnInit {
  public usuarioModel: Usuario;
  public token;
  public identidad;
  public Carrito
  public servicio
  public IdHabitacion
  public idHotelenUso
  public NombreHabitacion
  public carritoModel
  public ReservacionModel
  public carrito
  public facturaModel
  public TotalServicios
  constructor(
    private _carritoService: carritoService,
    private _router: Router
  ) {
    this.carritoModel = new carrito("","","",false,"",[{ Nombre: "", Descripcion:"", Precio:""}],0);
    this.facturaModel = new factura("","","","",false,"",0,0,"")

  }
  ngOnInit(): void {


    var Habitacion = localStorage.getItem("Habitacion")
    var Hotel = localStorage.getItem("HotelenUso")

    var idHotel = (JSON.parse(Hotel))[0]._id
    var HabitacionNombre = (JSON.parse(Habitacion)).Nombre;
    var idHabitacion = (JSON.parse(Habitacion))._id;


    this.IdHabitacion = idHabitacion


    this.idHotelenUso = idHotel
    this.NombreHabitacion = HabitacionNombre

    this.verServicio("Nada")
    this.obtenerReservacionActiva()
    this.VerCarrito("Hotel")
  }



  refresh(): void { window.location.reload(); }

  verServicio(nombre){

          nombre = this.idHotelenUso
    this._carritoService.obtenerServicio(nombre).subscribe(
      response =>{
        console.log(response)
        this.servicio = response.ServicioHotel

        console.log(this.servicio)

      }

    )
  }

  obtenerReservacionActiva(){
    this._carritoService.obtenerReservacionActiva().subscribe(
      response => {
        this.ReservacionModel = response.SinFacturar
        console.log(this.ReservacionModel)





      }

    )

  }

    obtenerNada(){}

  Facturar(){
    this.facturaModel.Hotel = this.idHotelenUso

    console.log(this.facturaModel)
    this._carritoService.Facturar(this.facturaModel).subscribe(
      response=>{
        console.log(response.mensaje)

        if(response.mensaje){
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: response.mensaje,
            showConfirmButton: false,
            timer: 5500,


          });

        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Reservacion Facturada',
            showConfirmButton: false,
            timer: 2500,


          });
          this._router.navigate(['/facturas']);
        }
      },
      (error)=>{
        console.log(error.error.mensaje);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: error.error.mensaje,
          showConfirmButton: false,
          timer: 3000,


        });

      }

      )

  }

  AgregarServicio(Nombre){
    var Hotel = localStorage.getItem("HotelenUso")

    var idHotel = (JSON.parse(Hotel))[0]._id

    this.idHotelenUso = idHotel
    this.carritoModel.Hotel = this.idHotelenUso
    this.carritoModel.Nombre = Nombre
    console.log(this.carritoModel)
    this._carritoService.carrito(this.carritoModel).subscribe(
      response=>{
        console.log(response)

        if(response.mensaje){
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: response.mensaje,
            showConfirmButton: false,
            timer: 3500,


          });

        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Servicio Agregado',
            showConfirmButton: false,
            timer: 2500,


          });
          this.refresh()
        }
      },
      (error)=>{
        console.log(error.error.mensaje);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: error.error.mensaje,
          showConfirmButton: false,
          timer: 3000,


        });

      }




    )
  }


  EliminarReservacion(id){
    this._carritoService.EliminarReservacion(id).subscribe(
      response=>{
        console.log(response.mensaje)

        if(response.mensaje ){
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: response.mensaje,
            showConfirmButton: false,
            timer: 3500,


          });

        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Reservacion Eliminada',
            showConfirmButton: false,
            timer: 2500,


          });

          this.obtenerReservacionActiva()

          this._router.navigate(['/habitaciones']);

        }
      },
      (error)=>{
        console.log(error.error.mensaje);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: error.error.mensaje,
          showConfirmButton: false,
          timer: 3000,


        });

      }

    )
  }


  VerCarrito(id){
    id = this.idHotelenUso

    this._carritoService.carritoEnProceso(id).subscribe(
      response=>{


        this.carrito = response.Carrito[0].Carrito
        this.TotalServicios = response.Carrito[0].PrecioServicios
        console.log(this.carritoModel)


      },
      (error)=>{
        console.log(error.error.mensaje);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: error.error.mensaje,
          showConfirmButton: false,
          timer: 3000,


        });

      }

    )
  }

}
