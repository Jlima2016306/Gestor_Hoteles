import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { reservacion } from '../../modelos/reservacion.model';
import { ReservacionService } from "../../servicios/reservacion.service";
import Swal from 'sweetalert2';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {factura} from "../../modelos/factura.model"


@Component({
  selector: 'app-reservacion',
  templateUrl: './reservacion.component.html',
  styleUrls: ['./reservacion.component.scss'],
  providers: [ReservacionService]

})
export class ReservacionComponent implements OnInit {
  public reservacion: reservacion;
  public factura : factura;

  public facturaModel : factura;
  public ReservacionModel
  public NombreHabitacion
  public fechasRestringidas

  public IdHabitacion

  public idHotelenUso
   NohayRestricciones = true
  model: NgbDateStruct;
SinFacturar

  constructor(
    private _reservacionService: ReservacionService,
    private _router: Router) {
    this.ReservacionModel = new reservacion("","","","","","",false);
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


    this.obtenerReservacionActiva()
    this.obtenerMesesBloqueados("0");
  }




  Facturar(){
    this.facturaModel.Hotel = this.idHotelenUso

    console.log(this.facturaModel)
    this._reservacionService.Facturar(this.facturaModel).subscribe(
      response=>{
        console.log(response.mensaje)

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



  AgregarReservacion(){

    var Habitacion = localStorage.getItem("Habitacion")
    var HotelEnUso = localStorage.getItem("HotelenUso")



    var HabitacionID = (JSON.parse(Habitacion))._id;
    console.log(HabitacionID)
    var HotelID = JSON.parse(HotelEnUso)[0]._id;

    this.ReservacionModel.Hotel = HotelID
    this.ReservacionModel.Habitacion = HabitacionID
    console.log(this.ReservacionModel)

    this._reservacionService.agregarReservacion(this.ReservacionModel).subscribe(
      response=>{
        console.log(response.mensaje)

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
            title: 'Reservacion Agregada',
            showConfirmButton: false,
            timer: 2500,


          });

          this.SinFacturar = true
          this.obtenerReservacionActiva()
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

  obtenerReservacionActiva(){
    this._reservacionService.obtenerReservacionActiva().subscribe(
      response => {
        this.ReservacionModel = response.SinFacturar
        console.log(this.reservacion)

        if(this.ReservacionModel.Hotel != null){
          this.SinFacturar= true
        }



      }

    )

  }



  obtenerNada(id){
    this._router.navigate(['/carrito']);

  }


  obtenerMesesBloqueados(id){
    this.ReservacionModel._id = this.idHotelenUso
    this.ReservacionModel.Habitacion = this.IdHabitacion

    this._reservacionService.obtenerMesesBloqueados(this.ReservacionModel).subscribe(
      response=>{
        console.log(response.mensaje)

        this.fechasRestringidas = response.Fechas

        if(response.mensaje){
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: response.mensaje,
            showConfirmButton: false,
            timer: 3500,


          });

        }else{




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
    this._reservacionService.EliminarReservacion(id).subscribe(
      response=>{
        console.log(response.mensaje)

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
            title: 'Reservacion Eliminada',
            showConfirmButton: false,
            timer: 2500,


          });
          this.SinFacturar = false

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
  refresh(): void { window.location.reload(); }

}






