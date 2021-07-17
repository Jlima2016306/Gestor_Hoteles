import { Component, OnInit } from '@angular/core';
import { habitacion} from 'src/app/modelos/habitaciones.model';
import { habitacionService} from '../../servicios/habitacion.service';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.scss']
})
export class HabitacionesComponent implements OnInit {
  public habitacion
  public HotelenUso
  public HabitacionModel : habitacion
  public VariableHotel
  public Duenno  = true
  constructor(private _habitacionService:habitacionService ,
    private _router: Router
    )
   {
     var N : String
     N = this.VariableHotel
    this.HabitacionModel = new habitacion("","","","",0, "");

   }

  ngOnInit(): void {
    var nuevo = localStorage.getItem("HotelenUso")
    nuevo = JSON.parse(nuevo).Nombre;

    this.obtenerHabitaciones(nuevo);
  }



  AgregarHabitacion(){
    var nuevo = localStorage.getItem("HotelenUso")
    nuevo = JSON.parse(nuevo)[0]._id;


    this.HabitacionModel.NombreHotel = nuevo
    console.log(this.VariableHotel)



      this._habitacionService.AgregarHabitacion(this.HabitacionModel).subscribe(
        response => {
          console.log(response);

          this.obtenerHabitaciones(this.VariableHotel);

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
              title: 'Habitacion Agregada',
              showConfirmButton: false,
              timer: 500,


            });

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

  obtenerHabitaciones(Nombre){
    var HotelEnUso = localStorage.getItem("HotelenUso")
    var UsuarioLocal = localStorage.getItem("identidad")

    var HotelNombre = JSON.parse(HotelEnUso)[0]._id;

    console.log(HotelEnUso)

    this._habitacionService.obtenerHabitacion(HotelNombre).subscribe(
      response => {

        var DuennoHotel = JSON.parse(HotelEnUso)[0].DueñoUsuario;

        UsuarioLocal = JSON.parse(UsuarioLocal).Usuario
        console.log(DuennoHotel)

        this.Duenno = false
        if(DuennoHotel == UsuarioLocal){
          this.Duenno = true
        }


        this.habitacion = response.Habitaciones
        this.VariableHotel = JSON.parse(HotelEnUso)[0].Nombre



      },

      error => {

        console.log(<any>error);
      }

    )
  }
  obtenerHabitacionID(id){
    this._habitacionService.obtenerHabitacionID(id).subscribe(
      response => {
        console.log(response);

        this.HabitacionModel = response.Habitaciones;
        localStorage.setItem('Habitacion', JSON.stringify(this.HabitacionModel));

        this._router.navigate(['/reservacion']);

      },

      error => {
        console.log(<any>error);

      }
    )
  }
  obtenerHabitacionID2(id){
    this._habitacionService.obtenerHabitacionID(id).subscribe(
      response => {
        console.log(response);

        this.HabitacionModel = response.Habitaciones;
        localStorage.setItem('Habitacion', JSON.stringify(this.HabitacionModel));


      },

      error => {
        console.log(<any>error);

      }
    )
  }

  editarHabitacion(){
    this._habitacionService.editarHabitacion(this.HabitacionModel).subscribe(
      response=>{
        this.obtenerHabitaciones(this.VariableHotel);
        console.log(response);

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
            title: 'Habitacion Editada',
            showConfirmButton: false,
            timer: 500,


          });

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


  eliminarHabitacion(id){
    this._habitacionService.eliminarHabitacion(id).subscribe(
      response=>{
        console.log(response);
        this.obtenerHabitaciones(this.VariableHotel);

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
            title: 'Habitacion Eliminada',
            showConfirmButton: false,
            timer: 500,


          });

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



}
