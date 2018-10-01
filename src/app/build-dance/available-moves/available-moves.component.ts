import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { ApiService } from '../../api.service';
import { UpdateMovesService } from '../../update-moves.service';

import { Move } from '../../move';
import { Position } from '../../position';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-available-moves',
  templateUrl: './available-moves.component.html',
  styleUrls: ['./available-moves.component.css'],
  providers: [ApiService, UpdateMovesService]
})
export class AvailableMovesComponent implements OnInit, OnChanges {

  public available_moves;

  @Input() danceArrayInMoveComponent;
  @Input() availableMovesInMoveComponent;
  // @Output() sendRequestToGetMovesUpdated = new EventEmitter();


  constructor(public apiService:ApiService,
              public updateMovesService:UpdateMovesService) { }

  ngOnInit() { // on Init we really want all moves visible...

    this.apiService.get_next_available_moves("next-moves", 415).subscribe((move_data:Move[]) => {
      this.available_moves = move_data
    });
  }

  ngOnChanges(changes:SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];
      let curVal = JSON.stringify(change.currentValue)
      let prevVal = JSON.stringify(change.previousValue);
      console.log(curVal)
      console.log(prevVal)
    }
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
