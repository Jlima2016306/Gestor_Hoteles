import { Injectable } from '@angular/core';
import { Hoteles } from '../modelos/hoteles.model';
import { habitacion } from '../modelos/habitaciones.model';
import { servicio } from '../modelos/servicio.model'
import { evento } from '../modelos/evento.model';

import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { GLOBAL } from "./global.service";

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  public url: String;
  public identidad;
  public token;
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }




//obtenerReservaciones =




obtenerReservacion(): Observable<any>{
  let headersToken = this.headersVariable.set('Authorization', this.getToken())

  return this._http.get(this.url + '/obtenerReservacion/', {headers: headersToken})

}

  obtenerHabitacion(nombre:String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/obtenerHabitacion/'+ nombre, {headers: headersToken})
  }

  //inicio


  agregarHotel(hotel: Hoteles): Observable<any>{
    let params = JSON.stringify(hotel);
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.post(this.url + '/agregarHoteles', params, {headers: headersToken});
  }


 //eventos
  agregarEvento(evento: evento): Observable<any>{
    let params = JSON.stringify(evento);
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.post(this.url + '/agregarEvento', params, {headers: headersToken});
  }

  obtenerEvento(nombre: String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.get(this.url + '/obtenerEvento/'+ nombre, {headers: headersToken})

  }

  obtenerEventoID(id: String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/obtenerEventoID/' + id , {headers: headersToken})
  }



  editarEvento(evento: evento): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    let params = JSON.stringify(evento);

    return this._http.post(this.url + '/EditarEvento/' + evento._id ,params, {headers: headersToken})
  }




  eliminarEvento(id: String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.put(this.url + '/EliminarEvento/' + id , {},{headers: headersToken})
  }

  //sevicios
  agregarServicio(servicio : servicio): Observable<any>{
    let params = JSON.stringify(servicio);

    let headersToken = this.headersVariable.set('Authorization', this.getToken());
    return this._http.post(this.url + '/agregarServicio',params, {headers: headersToken})

  }

  obtenerServicio(nombre:String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken());
    return this._http.get(this.url + '/obtenerServicio/'+ nombre, {headers: headersToken})

  }



  obtenerServicioID(id: String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/obtenerServicioID/' + id , {headers: headersToken})
  }



  editarServicio(Servicio: servicio): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    let params = JSON.stringify(Servicio);

    return this._http.post(this.url + '/EditarServicio/' + Servicio._id ,params, {headers: headersToken})
  }




  eliminarServicio(id: String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.put(this.url + '/EliminarServicio/' + id , {},{headers: headersToken})
  }





  obtenerHotel(): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/obtenerHotel', {headers: this.headersVariable});
  }

  Buscarhoteles(nombre: string): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/Buscarhoteles/'+ nombre, {headers: headersToken})
  }
//
  editarHoteles(hotel: Hoteles):Observable<any>{
    let params = JSON.stringify(hotel);
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.put(this.url + '/editarHoteles/' + hotel[0]._id, params, {headers: headersToken})
  }

  eliminarHotel(nombre:String): Observable<any>{

    let headersToken = this.headersVariable.set('Authorization', this.getToken());

    return this._http.put(this.url + '/eliminarHotel/' + nombre,{},{headers: headersToken})
  }


  verHospedados(): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.get(this.url + '/buscarUsuarioHospedado', {headers: headersToken})
  }

  getIdentidad(){
    var identidad2 = JSON.parse(localStorage.getItem('identidad'));
    if(identidad2 != 'undefined'){
      this.identidad = identidad2
    }else{
      this.identidad = null;
    }

    return this.identidad;
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

}
