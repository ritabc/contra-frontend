import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  API_URL : string = "http://localhost:3000/";

  constructor(public http: HttpClient) { }

  // GET next available moves based on last move end position
  public get_next_available_dances(path:string, previous_move_ending_position_id:number) {
    var endpoint = this.API_URL + path + '/?previous_move_ending_position_id=' + previous_move_ending_position_id.toString;
    return this.http.get(endpoint);
  } 

}
