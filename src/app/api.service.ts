import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Dance } from './dance';
import { Move } from './move';
import { Position } from './position';
@Injectable()
export class ApiService {

  API_URL : string = "http://localhost:3000/";

  constructor(public http: HttpClient) { }

  // GET next available moves based on last move end position
  public get_next_available_moves(path:string, previous_move_ending_position_id:string) {
    var endpoint = this.API_URL + path + '/?previous_move_ending_position_id=' + previous_move_ending_position_id;
    return this.http.get<Move[]>(endpoint);
  }

  // GET all positions (maybe I need to add groups (position shape?) to positions table for ease of displaying them)
  public get_positions(path:string) {
    var endpoint = this.API_URL + path;
    return this.http.get(endpoint);
  }

  public getPositionId(path:string, formation:string) {
    var endpoint = this.API_URL + path + '/?description=' + formation;
    return this.http.get(endpoint);
  }

  public getAllMoves(path:string) {
    var endpoint = this.API_URL + path;
    return this.http.get(endpoint);
  }

  public getAllDances(path:string) {
    var endpoint = this.API_URL + path;
    return this.http.get<Dance[]>(endpoint)
  }

  public getSteps(path:string, danceId:number) {
    var endpoint = this.API_URL + path + '/?dance_id=' + danceId.toString();
    return this.http.get<(Move|Position)[]>(endpoint)


    // let steps = (params:string) => {
    //   return this.http.get(params)
    // }
    // return steps(endpoint)
  }

  public getAnimationInfo(path:string, danceId:number) {
    var endpoint = this.API_URL + path + '/?dance_id=' + danceId.toString();
    return this.http.get(endpoint);
  }

}
