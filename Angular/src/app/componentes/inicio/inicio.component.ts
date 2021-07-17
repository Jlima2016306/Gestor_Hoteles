import { Component, OnInit } from '@angular/core';
import { Hoteles } from 'src/app/modelos/hoteles.model';
import { evento } from 'src/app/modelos/evento.model';
import {servicio} from 'src/app/modelos/servicio.model'
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { HotelService } from "../../servicios/hoteles.service";
import { Router } from '@angular/router';

import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { reservacion } from 'src/app/modelos/reservacion.model';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  providers: [HotelService],

})




export class InicioComponent implements OnInit {



  title = 'appBootstrap';

  model: NgbDateStruct;


  public HotelObtenidos;
  public Hotel;
  public hotel
  public HotelenUso
  public ModelHabitaciones: string
  public NombredelHotel: string

  public fugitivo: string

  public ServicioModel : servicio;
  public servicio;

  public EventoModel : evento

  public HotelModel: Hoteles;
  public MiHotelModel: Hoteles;
  public VariableHotel
  public DueñoHotel
  public vasr = 1
  public UsuariosH // la H es de hospedados
  public eventos
  public reservacion

  public UsuarioHB // Usuario Hospedado Buscado

  public NOmbreHotel

   NoInicioSesion = false

  Buscado = false;
  Admin=false;
  Duenno = false;
  Myhotel = false;


  public Dueño;


  constructor(private _HotelService: HotelService,
    private _router: Router
    )
   {
    this.HotelModel = new Hoteles("","","", 0,0,"");
    this.EventoModel = new evento("","","","","","","")
    this.MiHotelModel = new Hoteles("","","", 0,0,"");
    this.ServicioModel = new servicio("","","",0,"")
   }


  ngOnInit(): void {
    this.obtenerHoteles();
    this.Myhotel = false;

  }


  obtenerReservacion(){
    this._HotelService.obtenerReservacion().subscribe(
      response => {

        this.reservacion = response.Reservaciones

        var verhotel = this.reservacion[0].Hotel.Nombre
        console.log(verhotel)
      }
    )
  }



  verServicio(nombre){
    this._HotelService.obtenerServicio(nombre).subscribe(
      response =>{
        console.log(response)
        this.servicio = response.ServicioHotel

        console.log(this.servicio)

      }

    )
  }

  agregarServicio(){
    this._HotelService.agregarServicio(this.ServicioModel).subscribe(
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
            title: 'Evento Agregado',
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

  obtenerServicioID(id){
    console.log(id)
    this._HotelService.obtenerServicioID(id).subscribe(
      response=>{
        console.log(response)

        this.ServicioModel = response.ServicioObtenido

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

  editarServicio(){
    this._HotelService.editarServicio(this.ServicioModel).subscribe(
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
            title: 'Servicio Editado',
            showConfirmButton: false,
            timer: 500,


          });


        }


        this.refresh();




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

  eliminarServicio(id){
    this._HotelService.eliminarServicio(id).subscribe(
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
            title: 'Servicio Eliminado',
            showConfirmButton: false,
            timer: 500,


          });
          this.refresh();

        }


        this.BuscarHotelesNombre();


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



  agregarEvento(){
    this._HotelService.agregarEvento(this.EventoModel).subscribe(
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
            title: 'Evento Agregado',
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


  verEventos(nombre){

    this._HotelService.obtenerEvento(nombre).subscribe(
      response=>{
        console.log(response)

        this.eventos = response.EventosHotel;
        console.log(this.eventos)

      }
    )
  }


  obtenerEventoID(id){
    console.log(id)
    this._HotelService.obtenerEventoID(id).subscribe(
      response=>{
        console.log(response)

        this.EventoModel = response.EventoObtenido

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

  editarEvento(){
    this._HotelService.editarEvento(this.EventoModel).subscribe(
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
            title: 'Evento Editado',
            showConfirmButton: false,
            timer: 500,


          });
          this.refresh();


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

  eliminarEvento(id){
    this._HotelService.eliminarEvento(id).subscribe(
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
            title: 'Evento Eliminado',
            showConfirmButton: false,
            timer: 500,


          });
          this.refresh();

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

  verHospedados(){
    this.Buscado = false;
      this._HotelService.verHospedados().subscribe(
        response=>{
          this.UsuariosH = response.Usuarios
          console.log(this.UsuariosH)


        }
      )
  }





  buscarHospedados(nombre){
      var fugitivo = this.UsuariosH
      var fugitivoEncontrado = []
      var e = 0
      console.log(nombre)
      this.Buscado = true


      if(nombre != null && nombre != ""){

      for(var i=0; i<this.UsuariosH.length; i++){
        if(this.UsuariosH[i].Usuario.Usuario == nombre){

          fugitivoEncontrado[e] = this.UsuariosH[i]
          e++
        }




      }

      this.UsuarioHB = fugitivoEncontrado
      console.log(fugitivoEncontrado)


    }else{

      this.verHospedados();


    }
  }



  agregarHotel(){
    this._HotelService.agregarHotel(this.HotelModel).subscribe(
      response => {
        console.log(response)

        this.ngOnInit();

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
                title: 'Hotel Agregado',
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
    this._HotelService.obtenerHabitacion(Nombre).subscribe(
      response => {





        this.VariableHotel =  Nombre
        this.ModelHabitaciones = response.Habitaciones;


      },

      error => {
        console.log(<any>error);
      }

    )
  }

  refresh(): void { window.location.reload(); }


  obtenerHoteles(){

    localStorage.setItem('HotelenUso', JSON.stringify(null));
    var nuevo = localStorage.getItem("HotelenUso")
    console.log(nuevo)


    this._HotelService.obtenerHotel().subscribe(
      response => {
        this.Myhotel = false;

        console.log(response.HotelObtenidos)

        var nuevo = localStorage.getItem("identidad")






        this.Admin = false
        if(nuevo != null){
                if(JSON.parse(nuevo).rol == "ROL_ADMIN" ){
                 this.Admin =true
                  console.log(this.Admin)
        }}else{
          this.NoInicioSesion = true

        }

        this.Hotel = response.HotelObtenidos;

        for(var i = 0; i < this.Hotel.length; ++i){

          if(JSON.parse(nuevo).Usuario == this.Hotel[i].DueñoUsuario){
            this.Duenno= true
            this.Dueño = this.Hotel[i].Nombre;

            this._HotelService.Buscarhoteles(this.Dueño).subscribe(
              response=>{
                console.log(response);

                this.MiHotelModel = response.HotelObtenidos;
                console.log(this.MiHotelModel);
              })
            console.log(this.Dueño)
          }

        }

      },

      error => {
        console.log(<any>error);
      }
    )
  }

  obtenerHotelesNombre(nombre){
    if(nombre != null  && nombre != ""){

      this._HotelService.Buscarhoteles(nombre).subscribe(
        response=>{
          console.log(response);

          this.Hotel = response.HotelObtenidos;

        }
      )


    }else{
      this.ngOnInit();

    }



  }

  BuscarHotelesNombre(){
    this.Duenno = true;
    var nuevo = this.Dueño


    console.log(nuevo)

      this._HotelService.Buscarhoteles(nuevo).subscribe(
        response=>{
          console.log(response);
          this.Duenno = false;


          this.MiHotelModel = response.HotelObtenidos;
          console.log(this.MiHotelModel);

          this.NOmbreHotel = this.MiHotelModel[0].Nombre;

          this.Myhotel = true;

        }
      )

  }


  obtenerHotelesNombres(nombre){

    this._HotelService.Buscarhoteles(nombre).subscribe(
      response=>{
        this.obtenerHabitaciones(nombre)

        this.HotelenUso = response.HotelObtenidos;

        localStorage.setItem('HotelenUso', JSON.stringify(this.HotelenUso));

        this.HotelModel = response.HotelObtenidos;
        console.log(this.HotelModel[0].DueñoUsuario);
        var nuevo = localStorage.getItem("identidad")

        if(nuevo != null){
        this.Admin = false
        if(JSON.parse(nuevo).Usuario ==  this.HotelModel[0].DueñoUsuario){
          this.Admin =true
          console.log(this.Admin)
        }

      }else{
          this.NoInicioSesion = true
      }

        this._router.navigate(['/habitaciones']);



      }
    )
  }


  editarHotel(){
    this._HotelService.editarHoteles( this.MiHotelModel).subscribe(
      response=>{
        console.log(this.HotelModel);

        console.log(response);
        this.obtenerHoteles();


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
                title: 'Hotel Editado',
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

  eliminarHotel(nombre){

    this._HotelService.eliminarHotel(nombre).subscribe(
      response=>{
        console.log(response);
        this.obtenerHoteles();

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
                title: 'Hotel Editado',
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


