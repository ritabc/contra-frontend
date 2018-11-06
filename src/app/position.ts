export class Position{
  public id:number;
  public isFormation:boolean;
  public description:string;

  constructor(id, isFormation = false, name) {
    this.id = id;
    this.isFormation = isFormation;
    this.description = name;
  }

}
