import { Injectable } from '@angular/core';
import { Move } from './move';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UpdateMovesService {

  public next_available_moves: Move[]

  constructor(public apiService:ApiService) { }

  public updateMoves(lastPositionId:number) {
    this.apiService.get_next_available_moves("next-moves", lastPositionId).subscribe((move_data:Move[]) => {
      // debugger
      console.log(move_data)
      this.next_available_moves = move_data.map(function(element) {
        return element})
      // this.next_available_moves = move_data
      // console.log(this.next_available_moves)
      return this.next_available_moves
    })
  }

  // {
  //   this.apiService.get_next_available_moves("next-moves", lastPositionId).subscribe((move_data) => {
  //     console.log(typeof move_data.json())
  //     move_data.forEach(function(move_element){
  //       let move:Move = new Move(move_element.id, move_element.name);
  //       this.next_available_moves.push(move);
  //     }),
  //     console.log(this.next_available_moves);
  //   });
  //
  //   //
  //   //
  //   // console.log(move_data);
  //   // return(move_data);
  // }

}
