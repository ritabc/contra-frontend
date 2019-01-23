import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Dance } from './dance';
import { Move } from './move';
import { Position } from './position';
import { DanceMove } from './danceMove';

@Injectable()
export class ApiService {

  API_URL : string = "http://localhost:3000/";

  constructor(public http: HttpClient) { }

  // GET next available moves based on last move end position
  // Used in Build Dance Component
  public getNextAvailableMoves(previousMoveEndingPositionId:number) {
    var endpoint = this.API_URL + "next-moves" + '/?previous_move_ending_position_id=' + previousMoveEndingPositionId;
    return this.http.get<Move[]>(endpoint);
  }

  // GET all positions (maybe I need to add groups (position shape?) to positions table for ease of displaying them)
  public getAllPositions() {
    var endpoint = this.API_URL + "positions";
    return this.http.get(endpoint);
  }

  // Get Position Id by Description
  // Used currently only by Build Dance Component to Get Id's of Formation-positions
  public getPositionIdByDescription(description:string) {
    var endpoint = this.API_URL + "position" + '/?description=' + description;
    return this.http.get(endpoint);
  }

  // Used by Build Dance Component
  public getAllMoves() {
    var endpoint = this.API_URL + "moves";
    return this.http.get(endpoint);
  }

  // Used by Visualize/Choose-Dance Component
  // Probably stable
  public getAllDances() {
    var endpoint = this.API_URL + "dances";
    return this.http.get<Dance[]>(endpoint)
  }

  // Should be used by Visualize Component, which will:
  //// - receive danceId from ChooseDance Component, and
  //// - Calculate danceInfo using API service, and
  //// - Display Dance Title, Composer, Formation, and other info about the dance
  public getDanceInformation(danceId:number) {
    var endpoint = this.API_URL + 'dances?id=' + danceId.toString();
    return this.http.get<(Dance)>(endpoint)
  }

  // Doesn't need to deal with formation, or position 0 (Can start with move 1 and it's ending position.)
  // However, watch out, because previously this call did return JSON which started with formation-position
  // Needs to return <DanceMove[]>
  public getDanceMoves(danceId:number) {
    var endpoint = this.API_URL + 'dance-moves-info/?dance_id=' + danceId.toString();
    // return this.http.get<DanceMove[]>(endpoint) // don't think this'll work here
    return this.http.get(endpoint)

  }

}

// public getAnimationInfo(path:string, danceId:number) {
//   var endpoint = this.API_URL + path + '/?dance_id=' + danceId.toString();
//   return this.http.get(endpoint);
// }
