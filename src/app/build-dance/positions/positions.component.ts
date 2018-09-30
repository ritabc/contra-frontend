import { Component, OnInit, Input } from '@angular/core';

import { ApiService } from '../../api.service';
import { Position } from '../../position';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent implements OnInit {
  public positions:Array<Position>;

  @Input() danceArrayInPositionComponent:Number[];

  constructor(public apiService:ApiService) { }

  ngOnInit() {
    this.apiService.get_positions("positions").subscribe((position_data:Position[]) => {
      console.log(position_data);
      this.positions = position_data;
    });
  }

  public onPositionClick(event) {
    console.log(event.path[0].id);
    this.danceArrayInPositionComponent.push(event.path[0].id)
  }

}
