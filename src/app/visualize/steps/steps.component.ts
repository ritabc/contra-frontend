import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
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
  steps
  constructor(public apiService:ApiService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      // const from = JSON.stringify(change.previousValue);
      const to = JSON.stringify(parseInt(change.currentValue));
      if (propName === 'danceId') {
        this.apiService.getSteps('dance-composition', parseInt(to)).subscribe((stepsData) => {
          this.steps = stepsData
        });
      }
      // console.log(propName + " changed from " + from + " to " + to)
    }

  }


}
