import { Component, OnInit, Input } from '@angular/core';

import { ApiService } from '../../api.service';
import { Position } from '../../position';
import { Move } from '../../move';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {
  public positions:Array<Position>;

  @Input() danceArrayInPositionComponent;

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.get_positions("positions").subscribe((position_data:Position[]) => {
      console.log(position_data);
      this.positions = position_data;
    });
  }

  public onPositionAdd(event) {
    if (this.danceArrayInPositionComponent.slice(-1)[0] instanceof Move) {
      let position = new Position(event.path[0].id, false, event.path[0].outerText);
      this.danceArrayInPositionComponent.push(position)
    } else {
      alert("Whoops! A position can only be added when a move is the last element in the Draft")
    }

  }

}
