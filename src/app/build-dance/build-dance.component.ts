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
  public available_moves:Array<Move>;
  public positions:Array<Position>;

  constructor(public apiService:ApiService, public router:Router) { }

  ngOnInit() {
    this.apiService.get_next_available_moves("next-moves", 415).subscribe((move_data:Move[]) => {
      console.log(move_data);
      this.available_moves = move_data;
    });
    this.apiService.get_positions("positions").subscribe((position_data:Position[]) => {
      console.log(position_data);
      this.positions = position_data;
    });
  }
}
