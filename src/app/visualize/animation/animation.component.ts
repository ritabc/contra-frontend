import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { TweenLite, TweenMax, TimelineMax } from 'gsap/TweenMax';

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

  constructor(private el: ElementRef, private nameConverter:SnakeToCamelPipe) { }

  ngOnInit() {
    this.improperFormation();
    let startPos = this.improper(0);
    this.swingOnSidesOfSet(startPos)
    // this.balanceTheRing(startPos)
    // startPos = this.improper(0);
    // this.petronella(startPos);
    // startPos = this.oppositeBecket(0);
    // this.balanceTheRing(startPos);
    // startPos = this.oppositeBecket(0);
    // this.petronella(startPos);
    // startPos = this.improperProgressed(0);
    // this.balanceTheRing(0)

    // console.log(priorPos)
    // this.balanceTheRing(priorPos)
    // this.petronella(priorPos)
    // priorPos = this.oppositeBecket(0)
    // this.improperProgressed(4)
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      if (!change.firstChange) {
        // console.log(change.currentValue) // Array of Steps in dance
        let positions:Array<Position> = [];
        let moves:Array<Move> = [];
        change.currentValue.forEach(function(danceStep, index) { // iterate over danceSteps, compose positions and moves arrays
          if (index % 2 === 0) {
            positions.push(danceStep)
          } else if (index % 2 === 1) {
            moves.push(danceStep)
          }
        })
        console.log(positions, moves)
        this[this.nameConverter.transform(positions[0].description) + "Formation"]()
        let danceTimeline = new TimelineMax({})
        moves.forEach(function(move, index) {
          console.log("beginning of loop, index is: ", index)
          let moveMethod = this[this.nameConverter.transform(move.name)]
          let rubyPositionName = positions[index].description.toString()
          let positionName = this.nameConverter.transform(rubyPositionName);
          if (typeof moveMethod === 'function' && typeof this[positionName] === 'function' ) {
            let moveStartPositionGenerator = this[positionName](0); // 0 needs updating later based on which play through the user is on (aka how far red has gotten)
            danceTimeline.addCallback(moveMethod, index*2, [moveStartPositionGenerator]) // TODO: Ensure each move lasts 2 seconds
          } else {
            return null // OR should this be some variation of danceTimeline.killAll(false, true, false, true) // complete the killed things? kill tweens?  kill delayedCalls? kill timelines?
          }
          console.log("end of loop, index is: ", index)
        }, this)
        // positions.forEach((position, index) => {
        //   if (index === 0) {
        //     this[this.nameConverter.transform(position.description) + "Formation"]()
        //     moveStartPositioning = this[this.nameConverter.transform(position.description)](0);
        //   } else { // should work for all moves and their ending positions after the formation
        //     moveStartPositioning = this[this.nameConverter.transform(position.description)](0);
        //     let moveMethod = this[this.nameConverter.transform(moves[index-1].name)](0)
        //     if (typeof moveMethod === 'function') {
        //       danceTimeline.addCallback(moveMethod, index, [moveStartPositioning]);
        //       let positionMethod = this[this.nameConverter.transform(position.description)](0)
        //       if (typeof positionMethod === 'function') {
        //         // moveStartPositioning = this[positionMethod](0)
        //         danceTimeline.addCallback(function() {
        //           moveStartPositioning = positionMethod(0)
        //         }, (index + 0.5), [], this)
        //       } else { // if position method doesn't exist
        //         danceTimeline.killAll(false, false, false, true) // complete the killed things? kill tweens? kill delayedCalls? kill timelines?
        //       }
        //     } else { // if move method doesn't exist
        //       danceTimeline.killAll(false, false, false, true)
        //     }
        //   }
        // }, this)
      }
    }
  }

//=================================================
//               Formations
//=================================================

  public improperFormation() {
    console.log("hit formation setup")
    let dottedLarks = [this.L5, this.L3, this.L1];
    let solidLarks = [this.L6, this.L4, this.L2];
    let dottedRavens = [this.R5, this.R3, this.R1];
    let solidRavens = [this.R6, this.R4, this.R2];

    dottedLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = 240*index + 140 + 'px';
      bird.nativeElement.style.cy = '220px';
    })
    solidLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = 240*index + 20 + 'px';
      bird.nativeElement.style.cy = '100px';
    })
    dottedRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = 240*index + 140 + 'px';
      bird.nativeElement.style.cy = '100px';
    })
    solidRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = 240*index + 20 + 'px';
      bird.nativeElement.style.cy = '220px';
    })
  }
//=================================================
//               Positions
//=================================================
  // Set Positions Locations (which bird is at what cardinal direction?)
  // Needs to know whether couples are out?, prior birdsLocation.
  /// Re prior birdsLocation, can the move return that?
  // Positions progression number (aka where red is: 0 means start of dance, 12 is upper limit where everyone's back where they started). With this, couplesOut is calculated

  public improper(progressionNumber:number) {
    console.log("hit POSITION improper")
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
    console.log("hit POSITION oppositeBecket")
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
      } else if (prog % 2 === 0) {
        couplesOut = false
      } else { return null }
    }
    return birdsLocation
  }

  public improperProgressed(progressionNumber:number) {
    console.log("hit POSITION improperProgressed")
    let couplesOut:boolean;
    let birdsLocation:any = { nEBirds: [this.R6, this.R4, this.R2],
                              sEBirds: [this.L6, this.L4, this.L2],
                              sWBirds: [this.R5, this.R3, this.R1],
                              nWBirds: [this.L5, this.L3, this.L1] }
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
        let newNE = birdsLocation.nWBirds.shift();
        let newSE = birdsLocation.sWBirds.shift();
        let newSW = birdsLocation.sEBirds.pop();
        let newNW = birdsLocation.nEBirds.pop();
        birdsLocation.nEBirds.unshift(newNE)
        birdsLocation.sEBirds.unshift(newSE)
        birdsLocation.sWBirds.push(newSW)
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
        let newNE = birdsLocation.sEBirds.shift();
        let newSE = birdsLocation.nEBirds.shift();
        let newSW = birdsLocation.nWBirds.pop();
        let newNW = birdsLocation.sWBirds.pop();
        birdsLocation.nEBirds.unshift(newNE)
        birdsLocation.sEBirds.unshift(newSE)
        birdsLocation.sWBirds.push(newSW)
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
      }
    }
    return birdsLocation
  }

//=================================================
//               Moves
//=================================================

// Define Moves
/// Moves need to know:
// - whether couples are out?
// - is the move a progression?
// Instead of the animating move updating the birdsLocation varible, it will just animate, then return the ending position that it was given
// Note on animations: Remember that x and y changes in a .to addition to a timeline change the x and y relative to where they were before. Instead, use the absolute (where origin is 0,0) cx and cy positioning

  public balanceTheRing(startPos) {
    console.log("hit MOVE balanceTheRing")
    startPos.nEBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x:-40, y:40})
        .to(bird.nativeElement, 1, {x:0, y:0})
    })
    startPos.sEBirds.map(function(bird){
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x:-40, y:-40})
        .to(bird.nativeElement, 1, {x:0, y:0})
    })
    startPos.sWBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x:40, y:-40})
        .to(bird.nativeElement, 1, {x:0, y:0})
    })
    startPos.nWBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x:40, y:40})
        .to(bird.nativeElement, 1, {x:0, y:0})
    })
  }

  public petronella(startPos) {
    console.log("hit MOVE petronella")
    console.log(startPos.nEBirds[0].nativeElement.id, startPos.nEBirds[1].nativeElement.id, startPos.nEBirds[2].nativeElement.id)
    startPos.nEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement.style, 2, {cx: 240*i + 20})
    })
    startPos.sEBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement.style, 2, {cy:100})
    })
    startPos.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement.style, 2, {cx: 240*i + 140})
    })
    startPos.nWBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement.style, 2, {cy:220})
    })
  }

  public swingOnSidesOfSet(startPos, couplesOut:boolean = true) {
    console.log("Hit MOVE swingOnSidesOfSet")
    startPos.sEBirds.map(function(sEBird, i) {
      let tl = new TimelineMax()
      tl.to(sEBird.nativeElement.style, 0.25, {cx: 240*i + 100, cy:240})
      if (sEBird.nativeElement.id[0] === 'L') {
        tl.to(sEBird.nativeElement, 1.5, {rotation: 450, transformOrigin: "0 0"})
      } else if (sEBird.nativeElement.id[0] === 'R') {
        tl.to(sEBird.nativeElement, 1.5, {rotation: 630, transformOrigin: "0 0"})
      }
    })
    startPos.sWBirds.map(function(sWBird, i) {
      let tl = new TimelineMax()
      tl.to(sWBird.nativeElement.style, 0.25, {cx: 240*i + 60, cy:200})
      if (sWBird.nativeElement.id[0] === 'R') {
        tl.to(sWBird.nativeElement, 1.5, {rotation: 450, transformOrigin: "40 40"})
      } else if (sWBird.nativeElement.id[0] === 'L') {
        tl.to(sWBird.nativeElement, 1.5, {rotation: 630, transformOrigin: "40 40"})
      }
    })
  }

}
