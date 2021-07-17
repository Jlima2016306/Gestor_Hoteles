export class reservacion{
  constructor(
    public _id: String,
    public Usuario: String,
    public Habitacion: String,
    public Hotel: String,
    public FechaInit: String,
    public FechaEnd:String,
    public Terminada: Boolean
  ){}
}
