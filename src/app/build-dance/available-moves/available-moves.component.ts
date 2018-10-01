import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../../api.service';
import { Move } from '../../move';
import { Position } from '../../position';

@Component({
  selector: 'app-available-moves',
  templateUrl: './available-moves.component.html',
  styleUrls: ['./available-moves.component.css']
})
export class AvailableMovesComponent implements OnInit {

  public available_moves:Array<Move>;

  @Input() danceArrayInMoveComponent;
  // @Input() availableMovesInMoveComponent;
  @Output() sendRequestToGetMovesUpdated = new EventEmitter();


  constructor(public apiService:ApiService) { }

  ngOnInit() { // on Init we really want all moves visible...
    this.updateMoves(415)
  }

  public updateMoves(lastPositionId:number) {
    this.apiService.get_next_available_moves("next-moves", lastPositionId).subscribe((move_data:Move[]) => {
      console.log(move_data);
      this.available_moves = move_data;
    });
  }

  public onMoveAdd(event) {
    if (this.danceArrayInMoveComponent.slice(-1)[0] instanceof Position) {
      let move = new Move(event.path[0].id, event.path[0].outerText);
      this.danceArrayInMoveComponent.push(move);
    } else {
      alert("Whoops! A move can only be added when a position is the last element in the Draft")
    }
  }

}
