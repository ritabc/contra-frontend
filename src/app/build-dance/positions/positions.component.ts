import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ApiService } from '../../api.service';
import { Position } from '../../position';
import { Move } from '../../move';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
  providers: []
})
export class PositionsComponent implements OnInit {

  public positions:Array<Position>;

  @Input() draftArrayInPositionComponent;
  @Output() messageEvent = new EventEmitter<string>();

  constructor(public apiService:ApiService) { }

  sendMessage(positionId) {
    this.messageEvent.emit(positionId)
  }

  ngOnInit() {
    this.apiService.get_positions("positions").subscribe((position_data:Position[]) => {
      this.positions = position_data;
    });
  }

  public onPositionAdd(event) {
    if (this.draftArrayInPositionComponent.slice(-1)[0] instanceof Move) {
      let position = new Position(event.path[0].id, false, event.path[0].outerText);
      this.draftArrayInPositionComponent.push(position)
      this.sendMessage(position.id)
    } else {
      alert("Whoops! A position can only be added when a move is the last element in the Draft")
    }
  }
}
