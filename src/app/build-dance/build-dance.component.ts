import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../api.service';
import { Move } from '../move';

@Component({
  selector: 'app-build-dance',
  templateUrl: './build-dance.component.html',
  styleUrls: ['./build-dance.component.css']
})
export class BuildDanceComponent implements OnInit {
  public danceArray:Number[] = []

  constructor(public router:Router) { }

  ngOnInit() {
  }

  public onClickOfTest() {
    console.log(this.danceArray)
  }
}
