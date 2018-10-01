export class Position{
  public id:number;
  public isFormation:boolean;
  public displayName:string;

  constructor(id, isFormation, name) {
    this.id = id;
    this.isFormation = isFormation;
    this.displayName = name;
  }

}
