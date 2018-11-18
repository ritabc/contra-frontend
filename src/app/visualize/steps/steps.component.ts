import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../api.service';

import { Move } from '../../move';
import { Position } from '../../position';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit, OnChanges {
  @Input() danceId:number;
  @Output() nextEvent = new EventEmitter();
  steps;
  currentStepCounter:number = 0;

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.steps = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      // const from = JSON.stringify(change.previousValue);
      const to = JSON.stringify(parseInt(change.currentValue));
      if (propName === 'danceId') {
        this.apiService.getSteps('dance-composition', parseInt(to)).subscribe((stepsData) => {
          stepsData.forEach(function(step, i) {
            if (step.hasOwnProperty('description')) {
              let position = new Position(step.id, false, step['description'])
              if (i === 0) {
                position.isFormation = true
              }
              this.steps.push(position)
            }
            else if (step.hasOwnProperty('name')) {
              this.steps.push(new Move(step.id, step['name']))
            }
          }, this)
        });
      }
    }
  }

  public showNextStep() {
    // console.log(this.steps[this.currentStepCounter])
    this.nextEvent.emit(this.steps[this.currentStepCounter])
    this.increaseStepCounter();
  }

  private increaseStepCounter() {
    this.currentStepCounter++;
  }
}
