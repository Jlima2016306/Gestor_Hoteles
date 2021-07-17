import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { ReservacionService } from "../../servicios/reservacion.service";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.scss'],
  providers: [ReservacionService]
})
export class GraficasComponent implements OnInit {







public barChartOptions: ChartOptions = {
  responsive: true,
  // We use these empty structures as placeholders for dynamic theming.
  scales: { xAxes: [{}], yAxes: [{}] },
};
public barChartLabels: Label[] = ['RESERVACIONES DE HOTELES'];

public barChartType: ChartType = 'bar';
public barChartLegend = true;
public x = 1
public y = 2

public IdHabitacion
public NombreHabitacion
public idHotelenUso
ADMIN = false
constructor(
  private _reservacionService: ReservacionService

) {

}

ngOnInit(): void {
  this.CrearGrafica()
  this.colorRGB()
  this.CrearGraficaTopHoteles()


  var Habitacion = localStorage.getItem("Habitacion")
  var Hotel = localStorage.getItem("HotelenUso")

  var idHotel = (JSON.parse(Hotel))[0]._id
  var HabitacionNombre = (JSON.parse(Habitacion)).Nombre;
  var idHabitacion = (JSON.parse(Habitacion))._id;




}
public nombre = [{ }]

public barChartData: ChartDataSets[] = this.nombre;

public Nombre =[]
public Numero =[]
public Colores =[]

public pieChartLabels: Label[] = this.Nombre;
public pieChartData: number[] = this.Numero;
public pieChartType: ChartType = 'pie';
public pieChartLegend = true;
public pieChartPlugins = [pluginDataLabels];


public pieChartOptions: ChartOptions = {
  responsive: true,
  legend: {
    position: 'top',
  },
  plugins: {
    datalabels: {
      formatter: (value, ctx) => {
        const label = ctx.chart.data.labels[ctx.dataIndex];
        return label;
      },
    },
  }
};


public pieChartColors = [
  {
    backgroundColor: this.Colores,
  },
];


CrearGraficaTopHoteles(){

  var nuevo = localStorage.getItem("identidad")
  if(JSON.parse(nuevo).rol === "ROL_ADMIN"){
    console.log(JSON.parse(nuevo).rol)
    this.ADMIN =true
  }
  this._reservacionService.porcentajeHoteles().subscribe(
    reponse=>{
      console.log(reponse.PorcentajeHotel)
      var necesito = reponse.PorcentajeHotel
      console.log(this.nombre)


       for (var i = 0; i < necesito.length; i++) {
        this.Nombre[i] =  [necesito[i].NombreHotel]
        this.Numero[i] =  [ necesito[i].Porcentaje]
        this.Colores[i] =  [this.colorRGB()]
      }


      this.randomize()
      this.randomize()

      console.log(this.Nombre)
      console.log(this.Numero)
      console.log(this.Colores)


    }

  )
  }



CrearGrafica(){


  var nuevo = localStorage.getItem("identidad")
  if(JSON.parse(nuevo).rol === "ROL_ADMIN"){
    console.log(JSON.parse(nuevo).rol)
    this.ADMIN =true
  }

  this._reservacionService.porcentajeHoteles().subscribe(
reponse=>{
  console.log(reponse.PorcentajeHotel)
  var necesito = reponse.PorcentajeHotel
  console.log(this.nombre)



   for (var i = 0; i < necesito.length; i++) {
    this.nombre[i]= { data: [necesito[i].Reservaciones,necesito[i].Reservaciones], label: necesito[i].NombreHotel}
  }


  this.randomize()
  this.randomize()

  console.log(this.barChartType)

}

  )



}





 generarLetra(){
	var letras = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
	var numero = (Math.random()*15).toFixed(0);
	return letras[numero];
}

 colorHEX(){
	var coolor = "";
	for(var i=0;i<6;i++){
		coolor = coolor + this.generarLetra() ;
	}
	return "#" + coolor;
}

 generarNumero(numero){
	return (Math.random()*numero).toFixed(0);
}

 colorRGB(){
	var coolor = "("+this.generarNumero(255)+"," + this.generarNumero(255) + "," + this.generarNumero(255) + "," + 0.3 +")";
  var color = "rgb"+ coolor;
  console.log(color);
	return "rgb" + coolor;
}



// events
public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

public randomize(): void {
  this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
}



}

