import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

import { Dance } from '../dance';
import { Move } from '../move';
import { Position } from '../position';
import { SnakeToCamelPipe } from '../snakeToCamel.pipe';

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss']
})

export class VisualizeComponent implements OnInit {
  public animationData;
  public currentStep;
  public visualizeSteps:Array<Move|Position> =[];
  public visualizeMoves:Array<Move> =[];
  public visualizePositions:Array<Position> =[];

  public danceIdFromChooseDance:number;
  // public nEBirds = [];
  // public sEBirds = [];
  // public sWBirds = [];
  // public nWBirds = [];
  public danceData:Dance


  constructor(public apiService:ApiService, private snakeToCamel:SnakeToCamelPipe) { }

  ngOnInit() {
  }

  public handleDance(emittedDanceId) {
    this.danceIdFromChooseDance = emittedDanceId
    let danceId = emittedDanceId

    // Turn danceId into Dance Object
    this.apiService.getDanceInformation(danceId).subscribe((danceInformationFromApi) => {
      this.danceData = new Dance(danceId,
                                 danceInformationFromApi[0].name,
                                 danceInformationFromApi[0].writer,
                                 danceInformationFromApi[0].description,
                                 danceInformationFromApi[0].is_becket,
                                 danceInformationFromApi[0].out_couples_waiting_position)
    })
  }

  public handleSteps(emittedSteps) {
    this.visualizeSteps = emittedSteps;
    emittedSteps.forEach(function(step, i) {
      if (i % 2 === 0) {
        this.visualizePositions.push(step)
      } else if (i % 2 === 1) {
        this.visualizeMoves.push(step)
      }
    }, this)
  }

  public eventFromSteps(passed) {
    this.currentStep = passed;
    console.log(this.snakeToCamel.transform(this.currentStep.description))
  }
