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
  public danceArray = [];
  public improperFormationId:number;
  public becketFormationId:number;

  constructor(public router:Router, public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.getPositionId("position", 'improper').subscribe((improper_id_data) => {
      console.log(improper_id_data.id);
      this.improperFormationId = improper_id_data.id;
    });

    this.apiService.getPositionId("position", "becket").subscribe((becket_id_data) => {
      console.log(becket_id_data.id);
      this.becketFormationId = becket_id_data.id;
    });
  }

  public onClickOfTest() {
    console.log(this.danceArray)
  }

  public onFormationAdd(event) {
    console.log(event)
    let formation = new
    Position(event.path[0].id, true);
    this.danceArray.push(formation)
  }
}
