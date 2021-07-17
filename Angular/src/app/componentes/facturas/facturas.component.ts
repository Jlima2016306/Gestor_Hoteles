import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/modelos/usuario.model';
import {factura} from '../../modelos/factura.model'

import { carrito } from "../../modelos/carritoServicios.model"
import { carritoService } from 'src/app/servicios/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss'],
  providers: [carritoService]
})
export class FacturasComponent implements OnInit {

  public usuarioModel: Usuario;
  public token;
  public identidad;
  public facturas
  ADMIN = false
  Cliente = false
  Dueño = false

  constructor(
    private _carritoService: carritoService,
    private _router: Router
  ) {

  }
  ngOnInit(): void {




    this. ObtenerFacturas()
  }



  refresh(): void { window.location.reload(); }


  ObtenerFacturas(){


    var nuevo = localStorage.getItem("identidad")


    this._carritoService.ObtenerFacturas().subscribe(
      response => {
        console.log(response)
        this.facturas = response.Facturas


      }
    )

  }


  ObtenerPDF(id){
    this._carritoService.ObtenerPDF(id).subscribe(

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
            title: 'PDF Obtenido',
            showConfirmButton: false,
            timer: 2500,


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
