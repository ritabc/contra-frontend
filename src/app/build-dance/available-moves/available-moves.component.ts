import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../api.service';
import { Move } from '../../move';

@Component({
  selector: 'app-available-moves',
  templateUrl: './available-moves.component.html',
  styleUrls: ['./available-moves.component.css']
})
export class AvailableMovesComponent implements OnInit {
  public available_moves:Array<Move>;

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.get_next_available_moves("next-moves", 415).subscribe((move_data:Move[]) => {
      console.log(move_data);
      this.available_moves = move_data;
    });
  }

}
