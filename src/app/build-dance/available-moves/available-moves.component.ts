import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../../api.service';

import { Move } from '../../move';
import { Position } from '../../position';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-available-moves',
  templateUrl: './available-moves.component.html',
  styleUrls: ['./available-moves.component.css'],
  providers: [ApiService]
})
export class AvailableMovesComponent implements OnInit {

  public available_moves;

  @Input() danceArrayInMoveComponent;
  @Input() availableMovesInMoveComponent;
  @Input()
  set positionLastMoveEndsAtInMoveComponent(newValue) {
    this.apiService.get_next_available_moves("next-moves", newValue).subscribe((move_data:Move[]) => {
      this.available_moves = move_data
    });
  }

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.getAllMoves("moves").subscribe((move_data:Move[]) => {
      this.available_moves = move_data
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
