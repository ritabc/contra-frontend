import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../api.service';
import { Move } from '../move';
import { Position } from '../position';

@Component({
  selector: 'app-build-dance',
  templateUrl: './build-dance.component.html',
  styleUrls: ['./build-dance.component.css']
})
export class BuildDanceComponent implements OnInit {
  public draftArray = [];

  public availableMoves = [];
  public positionLastMoveEndsAt:number;
  public improperFormationId:number;
  public becketFormationId:number;

  public showPositionn() {
    console.log(this.positionLastMoveEndsAt)
  }

  constructor(public router:Router, public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.getPositionId("position",'improper').subscribe((improper_id_data) => {
      this.improperFormationId = improper_id_data['id'];
    });

    this.apiService.getPositionId("position", "becket").subscribe((becket_id_data) => {
      console.log(becket_id_data['id']);
      this.becketFormationId = becket_id_data['id'];
    });
  }

  receiveMessage($event) {
    this.positionLastMoveEndsAt = $event
  }

  public onClickOfTest() {
    console.log(this.availableMoves)
  }

  public onFormationAdd(event) {
    if (this.draftArray.length === 0) {
      let formation = new   Position(event.path[0].id, true, event.path[0].outerText);
      this.draftArray.push(formation);
      console.log(formation.id)
      this.positionLastMoveEndsAt = formation.id
    } else {
      alert("Whoops! A formation is a starting point and cannot be added after moves or other positions have been added")
    }
  }
}
