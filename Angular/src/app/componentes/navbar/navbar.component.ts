import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [UsuarioService]
})
export class NavbarComponent implements OnInit {
  public identidad;
  public reload;
  hotel = false
  ADMIN = false;
  public usuarioConoectado

  constructor(public _usuarioService: UsuarioService,    private _router: Router) {
    this.identidad = this._usuarioService.getIdentidad();






   }




   refresh(): void { window.location.reload(); }


  ngOnInit(): void {



  }




  cerrarSesion(){
    localStorage.setItem('identidad', null);


    this._router.navigate(['/login']);
  }

}
