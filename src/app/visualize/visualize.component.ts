import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

import { Dance } from '../dance';
import { Move } from '../move';
import { Position } from '../position';
import { DanceMove } from '../danceMove';
import { SnakeToCamelPipe } from '../snakeToCamel.pipe';

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss']
})

export class VisualizeComponent implements OnInit {
  public currentStep;

  public danceIdFromChooseDance:number;
  public chosenDance:Dance;
  public chosenDanceMoves:Array<DanceMove> = [];
  public chosenDanceFormation:Position;

  constructor(public apiService:ApiService, private snakeToCamel:SnakeToCamelPipe) { }

  ngOnInit() {
  }

  public handleDance(emittedDanceId) {
    this.danceIdFromChooseDance = emittedDanceId
    console.log(this.danceIdFromChooseDance)

    // Turn danceId into Dance Object
    this.apiService.getDanceInformation(this.danceIdFromChooseDance).subscribe((danceInformationFromApi) => {
      this.chosenDance = new Dance(this.danceIdFromChooseDance,
                                 danceInformationFromApi[0].name,
                                 danceInformationFromApi[0].writer,
                                 danceInformationFromApi[0].description,
                                 danceInformationFromApi[0].is_becket,
                                 danceInformationFromApi[0].out_couples_waiting_position)
    })

    // Turn this.danceIdFromChooseDance into danceMoves
    this.apiService.getDanceMoves(this.danceIdFromChooseDance).subscribe((danceMovesData:DanceMove[]) => {
      danceMovesData.forEach(function(danceMove) {
        let move = new Move(danceMove.move.id, danceMove.move.name);
        let endingPosition = new Position(danceMove.endingPosition.id, false, danceMove.endingPosition.description)
        this.chosenDanceMoves.push(new DanceMove(move, endingPosition, danceMove.isProgression))
      }, this)
    })
  }

  // probably now irrelevant, but concept is still necessary so keep for now
  public eventFromSteps(passed) {
    this.currentStep = passed;
    console.log(this.snakeToCamel.transform(this.currentStep.description))
  }
}

// might not be necessary
// public handleSteps(emittedSteps) {
//   this.visualizeSteps = emittedSteps;
//   emittedSteps.forEach(function(step, i) {
//     if (i % 2 === 0) {
//       this.visualizePositions.push(step)
//     } else if (i % 2 === 1) {
//       this.visualizeMoves.push(step)
//     }
//   }, this)
// }
