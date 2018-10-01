import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../../api.service';
import { UpdateMovesService } from '../../update-moves.service';
import { Position } from '../../position';
import { Move } from '../../move';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
  providers: [UpdateMovesService]
})
export class PositionsComponent implements OnInit {

  public positions:Array<Position>;

  @Input() danceArrayInPositionComponent;
  // @Input () availableMovesInPositionComponent
  @Output() sendRequestToGetMovesUpdated = new EventEmitter();

  constructor(public apiService:ApiService, public updateMovesService:UpdateMovesService) { }

  ngOnInit() {
    this.apiService.get_positions("positions").subscribe((position_data:Position[]) => {
      this.positions = position_data;
    });
  }

  public onPositionAdd(event) {
    if (this.danceArrayInPositionComponent.slice(-1)[0] instanceof Move) {
      let position = new Position(event.path[0].id, false, event.path[0].outerText);
      this.danceArrayInPositionComponent.push(position)
      this.updateMovesService.updateMoves(position.id)
      // this.apiService.get_next_available_moves("next-moves", position.id).subscribe((move_data:Move[]) => {
      //   console.log(move_data)
      //   this.availableMovesInPositionComponent = move_data;
      //   console.log(this.availableMovesInPositionComponent);
      // });
    } else {
      alert("Whoops! A position can only be added when a move is the last element in the Draft")
    }

  }

}
