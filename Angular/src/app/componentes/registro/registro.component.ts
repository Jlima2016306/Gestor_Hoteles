import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../modelos/usuario.model';
import { UsuarioService } from "../../servicios/usuario.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  providers: [UsuarioService]
})
export class RegistroComponent implements OnInit {
  public user: Usuario;



  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router) {
    this.user = new Usuario("","","","");
   }

  ngOnInit(): void {

  }

  registrar(){
    console.log(this.user)

    this._usuarioService.registro(this.user).subscribe(
      response=>{
        console.log(response);
        this._router.navigate(['/login'])
      },
      error=>{
        console.log(<any>error);

      }
    )
  }

}
