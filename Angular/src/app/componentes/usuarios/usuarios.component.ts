import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/usuario.model';
import { UsuarioService } from "../../servicios/usuario.service";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [UsuarioService]
})
export class UsuariosComponent implements OnInit {
  public usuarios;
  public idUsuarioModel: Usuario;
  Admin=true;

  constructor(private _usuarioService: UsuarioService,
    private _router: Router
    )
   {
    this.idUsuarioModel = new Usuario("","","","");

   }

  ngOnInit(): void {

      this.obtenerUsuarios();



  }




  obtenerUsuarios(){


    this._usuarioService.obtenerUsuarios().subscribe(
      response => {

        var nuevo = localStorage.getItem("identidad")


        this.Admin = false
        if(JSON.parse(nuevo).rol == "ROL_ADMIN"){
          this.Admin =true
          console.log(this.Admin)
        }

        this.usuarios = response.usuarios;
        console.log(response.usuarios)


      },

      error => {
        console.log(<any>error);
      }
    )
  }

  obtenerUsuarioId(idUsuario){
    this._usuarioService.obtenerUsuarioId(idUsuario).subscribe(
      response=>{
        this.idUsuarioModel = response.usuarioEncontrado;
        console.log(response);

      }
    )
  }

  editarUsuario(){
    this._usuarioService.editarUsaurio(this.idUsuarioModel).subscribe(
      response=>{
        console.log(this.idUsuarioModel);

        console.log(response);
        this.obtenerUsuarios();
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
              title: 'Usuario Editado',
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

  eliminarUsuario(nombre){
    this._usuarioService.eliminarUsuario(nombre).subscribe(
      response=>{


        localStorage.setItem('identidad', null);


        this._router.navigate(['/login']);

        console.log(response);
        this.obtenerUsuarios();
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
              title: 'Usuario Eliminado',
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
