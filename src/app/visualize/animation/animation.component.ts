import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { TweenMax, TimelineMax } from 'gsap/TweenMax';

import { Move } from '../../move';
import { Position } from '../../position';
import { SnakeToCamelPipe } from '../../snakeToCamel.pipe';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})

export class AnimationComponent implements OnInit, OnChanges {
  @Input() steps:Array<Move|Position>
  @ViewChild('R1') private R1:ElementRef;
  @ViewChild('L1') private L1:ElementRef;
  @ViewChild('R2') private R2:ElementRef;
  @ViewChild('L2') private L2:ElementRef;
  @ViewChild('R3') private R3:ElementRef;
  @ViewChild('L3') private L3:ElementRef;
  @ViewChild('R4') private R4:ElementRef;
  @ViewChild('L4') private L4:ElementRef;
  @ViewChild('R5') private R5:ElementRef;
  @ViewChild('L5') private L5:ElementRef;
  @ViewChild('R6') private R6:ElementRef;
  @ViewChild('L6') private L6:ElementRef;

  public birdsLocation
  // public birdsLocation = { nEBirds: [this.R5, this.R3, this.R1],
  //                          sEBirds: [this.L5, this.L3, this.L1],
  //                          sWBirds: [this.R6, this.R4, this.R2],
  //                          nWBirds: [this.L6, this.L4, this.L2] };

  constructor(private el: ElementRef, private snakeToCamel:SnakeToCamelPipe) { }

  ngOnInit() {

    let progression = 0;
    let nextPositioning = this.improper(progression);
    this.oppositeBecket(3)
    // if improper:
    // this.birdsLocation = { nEBirds: [this.R5, this.R3, this.R1],
    //                        sEBirds: [this.L5, this.L3, this.L1],
    //                        sWBirds: [this.R6, this.R4, this.R2],
    //                        nWBirds: [this.L6, this.L4, this.L2] };
    // this.balanceTheRing();
    // // this.improper();
    // this.petronella();
    // // this.oppositeBecket();
    // this.balanceTheRing();
    // this.petronella();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      if (!change.firstChange) {
        // console.log(change.currentValue) // Array of Steps in dance
        let positions:Array<Position> = [];
        let moves:Array<Move> = [];
        change.currentValue.forEach(function(step, index) { // iterate over steps, compose positions and moves arrays
          if (index % 2 === 0) {
            positions.push(step)
          } else if (index % 2 === 1) {
            moves.push(step)
          }
        }, this)
        console.log(positions, moves)
        let priorPositioning:any
        let endPositioning:any
        for (let i:number = 0; i <= positions.length; ++i) { // check ending condition later
          if (i === 0) {
            this[this.snakeToCamel.transform(positions[i].description) + "Formation"]();
            priorPositioning = this[this.snakeToCamel.transform(positions[i].description)]();
          } else {
            // run move
            endPositioning = this[this.snakeToCamel.transform(positions[i].description)]();
            this[this.snakeToCamel.transform(moves[i-1].name)](priorPositioning, endPositioning)
          }
        }
      }
    }
  }

  // Setup Formations
  public improperFormation() {
    let dottedLarks = [this.L5, this.L3, this.L1];
    let solidLarks = [this.L6, this.L4, this.L2];
    let dottedRavens = [this.R5, this.R3, this.R1];
    let solidRavens = [this.R6, this.R4, this.R2];

    dottedLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
      bird.nativeElement.style.cy = '220px';
    })
    solidLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
      bird.nativeElement.style.cy = '100px';
    })
    dottedRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
      bird.nativeElement.style.cy = '100px';
    })
    solidRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
      bird.nativeElement.style.cy = '220px';
    })
  }

  // Set Positions Locations (which bird is at what cardinal direction?)
  // Needs to know whether couples are out?, prior birdsLocation.
  /// Re prior birdsLocation, can the move return that?
  // Positions progression number (aka where red is: 0 means start of dance, 12 is upper limit where everyone's back where they started). With this, couplesOut is calculated

  public improper(progressionNumber:Number) {
    let couplesOut:boolean;
    let birdsLocation:any = { nEBirds: [this.R5, this.R3, this.R1],
                              sEBirds: [this.L5, this.L3, this.L1],
                              sWBirds: [this.R6, this.R4, this.R2],
                              nWBirds: [this.L6, this.L4, this.L2] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
        couplesOut = false
      } else if (prog % 2 === 1) {
        couplesOut = true
        let newNE = birdsLocation.sEBirds.shift();
        let newSE = birdsLocation.nEBirds.shift();
        birdsLocation.nEBirds.unshift(newNE);
        birdsLocation.sEBirds.unshift(newSE);
        let newSW = birdsLocation.nWBirds.pop();
        let newNW = birdsLocation.sWBirds.pop();
        birdsLocation.sWBirds.push(newSW);
        birdsLocation.nWBirds.push(newNW);
      } else if (prog % 2 === 0) {
        couplesOut = false
        let newNE = birdsLocation.nWBirds.pop();
        birdsLocation.nEBirds.push(newNE);
        let newSE = birdsLocation.sWBirds.pop();
        birdsLocation.sEBirds.push(newSE);
        let newSW = birdsLocation.sEBirds.shift();
        birdsLocation.sWBirds.unshift(newSW);
        let newNW = birdsLocation.nEBirds.shift();
        birdsLocation.nWBirds.unshift(newNW);
      } else { return null }
    }
    return birdsLocation;
  }

  public oppositeBecket(progressionNumber:number) {
    let couplesOut:boolean;
    let birdsLocation:any = { nEBirds: [this.L5, this.L3, this.L1],
                              sEBirds: [this.R6, this.R4, this.R2],
                              sWBirds: [this.L6, this.L4, this.L2],
                              nWBirds: [this.R5, this.R3, this.R1] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
        couplesOut = false
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "nE", birdsLocation.nEBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "sE", birdsLocation.sEBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "sW", birdsLocation.sWBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "nW", birdsLocation.nWBirds[i])
        // }
      } else if (prog % 2 === 1) {
        couplesOut = true
        let newNE = birdsLocation.sWBirds.pop();
        let newSE = birdsLocation.nWBirds.shift();
        let newSW = birdsLocation.nEBirds.shift();
        let newNW = birdsLocation.sEBirds.pop();
        birdsLocation.nEBirds.push(newNE)
        birdsLocation.sEBirds.unshift(newSE)
        birdsLocation.sWBirds.unshift(newSW)
        birdsLocation.nWBirds.push(newNW)
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "nE", birdsLocation.nEBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "sE", birdsLocation.sEBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "sW", birdsLocation.sWBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "nW", birdsLocation.nWBirds[i])
        // }
      } else if (prog % 2 === 0) {
        couplesOut = false
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "nE", birdsLocation.nEBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "sE", birdsLocation.sEBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "sW", birdsLocation.sWBirds[i])
        // }
        // for (let i = 0; i <= 2; ++i) {
        //   console.log(prog, "nW", birdsLocation.nWBirds[i])
        // }
      } else { return null }
    }
    return birdsLocation
  }

// Define Moves
/// Moves need to know:
// starting position
// - ending_pos, (Dont freak out: doesn't really do anything with this except return it)
// - whether couples are out?
// - is the move a progression?
// Instead of the animating move updating the birdsLocation varible, it will just animate, then return the ending position that it was given

  public balanceTheRing(startPos, endPos) {
    this.birdsLocation.nEBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:-40, y:40})
        .to(bird, 1, {x:0, y:0})
    })
    this.birdsLocation.sEBirds.map(function(bird){
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:-40, y:-40})
        .to(bird, 1, {x:0, y:0})
    })
    this.birdsLocation.sWBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:40, y:-40})
        .to(bird, 1, {x:0, y:0})
    })
    this.birdsLocation.nWBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:40, y:40})
        .to(bird, 1, {x:0, y:0})
    })
  }

  public petronella() {
    this.birdsLocation.nEBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:-120, y:0})
    })
    this.birdsLocation.sEBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:0, y:-120})
    })
    this.birdsLocation.sWBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:120, y:0})
    })
    this.birdsLocation.nWBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:0, y:120})
    })
    // petronella needs to update this.birdsLocation, but in the relative sense - relative to where birds were before
    console.log(this.birdsLocation.nWBirds)
    let currentnWBirds = this.birdsLocation.nWBirds
    this.birdsLocation.nWBirds = this.birdsLocation.nEBirds
    this.birdsLocation.nEBirds = this.birdsLocation.sEBirds
    this.birdsLocation.sEBirds = this.birdsLocation.sWBirds
    this.birdsLocation.sWBirds = currentnWBirds
    // return this // ?? should this be here?
    console.log(this.birdsLocation.nWBirds)
  }

}
