import { Injectable } from '@angular/core';
import { habitacion } from '../modelos/habitaciones.model';
import { reservacion } from '../modelos/reservacion.model'
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { factura } from "../modelos/factura.model"

import { GLOBAL } from "./global.service";


@Injectable({
  providedIn: 'root'
})
export class ReservacionService {
  public url: String;
  public habitaciones
  public HotelenUso;
  public token;
  public Habitacion
  public reservacion
  public headersVariable = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }


  ngOnInit(): void {
    this.getHotel();
    this.getHabitacion();
  }


  Facturar(factura : factura): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    let params = JSON.stringify(factura);

    return this._http.post(this.url + '/Facturar', params, { headers: headersToken })
  }


  agregarReservacion(reservacion): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    let params = JSON.stringify(reservacion);

    return this._http.post(this.url + '/agregarReservacion', params, { headers: headersToken })
    // `${this.url}/registrarUsuario`
  }





  obtenerReservacion(nombre:String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    this.getHabitacion();

    return this._http.get(this.url + '/obtenerReservacion'+ nombre, {headers: headersToken})

  }

  obtenerReservacionActiva(): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/obtenerReservacionActiva', {headers: headersToken})


  }

  porcentajeHoteles(): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/porcentajeHoteles', {headers: headersToken})


  }


  EliminarReservacion(id:string): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.put(this.url + '/EliminarReservacion/'+id,{}, {headers: headersToken})



  }

  obtenerMesesBloqueados(id: reservacion): Observable<any>{
    let params = JSON.stringify(id);

    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.post(this.url + '/obtenerMesesBloqueados/' + id._id, params , {headers: headersToken})

  }




  obtenerHabitacionID(id:string): Observable<any>{
      let headersToken = this.headersVariable.set('Authorization', this.getToken())
      return this._http.get(this.url + '/obtenerHabitacionID/' + id, {headers: headersToken})
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
