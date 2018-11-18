import { Component, OnInit, Input } from '@angular/core';

import { Move } from '../../move';
import { Position } from '../../position';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
export class DraftComponent implements OnInit {

  @Input() dancePieces;

  constructor() {
  }

  ngOnInit() {
  }

  public printPiece(piece) {
    console.log(piece)
  }

}
