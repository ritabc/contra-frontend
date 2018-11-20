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
  @Input() steps: Array<Move|Position>;
  currentStepCounter:number = 0;

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    console.log(this.steps)
  }

  ngOnChanges(changes: SimpleChanges) { // CT: set this.steps somehow (after click of Dance BTn). poss. not w/this ngOnChanges
    // for (const propName of Object.keys(changes)) {
    //   const change = changes[propName];
    // }
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
