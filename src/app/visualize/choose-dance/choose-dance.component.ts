import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

import { Dance } from '../../dance'
@Component({
  selector: 'app-choose-dance',
  templateUrl: './choose-dance.component.html',
  styleUrls: ['./choose-dance.component.css'],
  providers: [ApiService]
})
export class ChooseDanceComponent implements OnInit {
  public allDances

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.getAllDances("dances").subscribe((danceData:Dance[]) => {
      this.allDances = danceData
      console.log(this.allDances)
    });
  }

}
