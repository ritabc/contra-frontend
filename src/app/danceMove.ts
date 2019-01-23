import { Move } from './move'
import { Position } from './position'

// similar to Rails dance_move, expect this type will be called in a dance, so will not be standalone and thus doesn't need a danceId
export class DanceMove {
  public move:Move;
  public endingPosition:Position;
  public isProgression:boolean;

  constructor(move, endingPosition, isProgression) {
    this.move = move;
    this.endingPosition = endingPosition;
    this.isProgression = isProgression;
  }
}
