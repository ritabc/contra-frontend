export class Dance {
  public id:number;
  public name:string;
  public writer:string;
  public description:string;
  public isBecket:boolean;
  public outCouplesWaitingPosition:string;

  constructor(id, name, writer, description, isBecket, outCouplesWaitingPosition) {
    this.id = id;
    this.name = name;
    this.writer = writer;
    this.description = description;
    this.isBecket = isBecket;
    this.outCouplesWaitingPosition = outCouplesWaitingPosition;
  }
}
