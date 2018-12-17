import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../api.service';

import { Dance } from '../../dance'
import { Move } from '../../move'
import { Position } from '../../position'

@Component({
  selector: 'app-choose-dance',
  templateUrl: './choose-dance.component.html',
  styleUrls: ['./choose-dance.component.css'],
  providers: [ApiService]
})
export class ChooseDanceComponent implements OnInit {
  public allDances:Dance[]=[];
  private internalDanceId
  @Output() danceStepsFromChooseDance: EventEmitter<any> = new EventEmitter();
  @Output() danceIdFromChooseDance: EventEmitter<any> = new EventEmitter();

  // @Output() chooseDanceToOutput: EventEmitter<number> = new EventEmitter();

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.getAllDances("dances").subscribe((danceData) => {
      danceData.forEach(function(dance) {
        this.allDances.push(new Dance(dance.id, dance.name, dance.writer, dance.description, dance.isBecket, dance.outCouplesWaitingPosition))
      }, this)
    })
  }

  public emitDanceIdFromChosenDance(event) {
    this.internalDanceId = event.path[0].id
    this.danceIdFromChooseDance.emit(this.internalDanceId)
  }

  public emitStepsFromChosenDance(event) {
    let steps:Array<Move|Position>;
    this.apiService.getSteps(this.internalDanceId).subscribe((stepsData) => {
      stepsData.forEach(function(step, i) {
        if (step.hasOwnProperty('description')) {
          let position = new Position(step.id, false, step['description'])
          if (i === 0) {
            position.isFormation = true
          }
          this.danceStepsFromChooseDance.push(position)
        }
        else if (step.hasOwnProperty('name')) {
          this.danceStepsFromChooseDance.push(new Move(step.id, step['name']))
        }
      }, this)
    })
    this.danceStepsFromChooseDance.emit(steps)
  }

}
