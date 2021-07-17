import { Injectable } from '@angular/core';
import { habitacion } from '../modelos/habitaciones.model';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { GLOBAL } from "./global.service";

@Injectable({
  providedIn: 'root'
})
export class habitacionService {
  public url: String;
  public habitaciones
  public HotelenUso;
  public token;
  public Habitacion
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.getHotel();
    this.getHabitacion();
  }


  AgregarHabitacion(habitacion): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    let params = JSON.stringify(habitacion);

    return this._http.post(this.url + '/agregarHabitacion', params, { headers: headersToken })
    // `${this.url}/registrarUsuario`
  }



  obtenerHabitacion(nombre:String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    this.getHabitacion();

    return this._http.get(this.url + '/obtenerHabitacion/'+ nombre, {headers: headersToken})


  }

  obtenerHabitacionID(id:string): Observable<any>{
      let headersToken = this.headersVariable.set('Authorization', this.getToken())
      return this._http.get(this.url + '/obtenerHabitacionID/' + id, {headers: headersToken})
  }

  editarHabitacion(habitaciones: habitacion):Observable<any>{
    let params = JSON.stringify(habitaciones);
    let headersToken = this.headersVariable.set('Authorization', this.getToken())


    return this._http.put(this.url + '/editarHabitacion/' + habitaciones._id, params, {headers: headersToken})
  }


  eliminarHabitacion(id:String): Observable<any>{

    let headersToken = this.headersVariable.set('Authorization', this.getToken());

    return this._http.put(this.url + '/eliminarHabitacion/' + id,{},{headers: headersToken})
  }

  getToken(){
    var token2 = localStorage.getItem('token');

    if(token2 != 'undefined'){
      this.token = token2;
      console.log(this.token)
    }else{
      this.token = null;
    }

    return this.token;
  }

  getHotel(){
    var HotelenUso2 = localStorage.getItem('HotelenUso');

    if(HotelenUso2 != 'undefined'){
      this.HotelenUso = HotelenUso2;
      console.log(this.HotelenUso)
    }else{
      this.HotelenUso = null;
    }

    return this.HotelenUso;
  }

  getHabitacion(){
    var Habitacion2 = localStorage.getItem('Habitacion');

    if(Habitacion2 != 'undefined'){
      this.HotelenUso = Habitacion2;
      console.log(this.Habitacion)
    }else{
      this.Habitacion = null;
    }

    return this.Habitacion;
  }


}

