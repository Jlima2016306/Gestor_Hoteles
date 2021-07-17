import { Injectable } from '@angular/core';

import { carrito } from '../modelos/carritoServicios.model';
import { factura } from '../modelos/factura.model';



import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from "./global.service";


@Injectable({
  providedIn: 'root'
})
export class carritoService {
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

  Facturar(factura : factura): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    let params = JSON.stringify(factura);

    return this._http.post(this.url + '/Facturar', params, { headers: headersToken })
  }


  obtenerReservacionActiva(): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/obtenerReservacionActiva', {headers: headersToken})


  }


  obtenerServicio(nombre:String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken());
    return this._http.get(this.url + '/obtenerServicio/'+ nombre, {headers: headersToken})

  }




  obtenerServicioID(id: String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.get(this.url + '/obtenerServicioID/' + id , {headers: headersToken})
  }

  ObtenerFacturas(): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.get(this.url + '/ObtenerFacturas', {headers: headersToken})

  }


  ObtenerPDF(id:String): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.get(this.url + '/PDF/'+ id, {headers: headersToken})


  }


  //carrito

  carrito(Carrito: carrito): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    let params = JSON.stringify(Carrito);
    console.log(params)

    return this._http.post(this.url + '/carrito', params, { headers: headersToken })
    // `${this.url}/registrarUsuario`

  }

  carritoEnProceso(id: string): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.get(this.url + '/carritoEnProceso/' + id, {headers: headersToken})

  }

  HistorialServicios(): Observable<any>{

    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.get(this.url + '/HistorialServicios', {headers: headersToken})

  }


  EliminarReservacion(id:string): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())

    return this._http.put(this.url + '/EliminarReservacion/'+id,{}, {headers: headersToken})



  }


  mostrarHistorialHoteles(): Observable<any>{
    let headersToken = this.headersVariable.set('Authorization', this.getToken())
    return this._http.get(this.url + '/mostrarHistorialHoteles', {headers: headersToken})

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

