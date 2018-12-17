import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { TweenLite, TweenMax, TimelineMax, CSSPlugin } from 'gsap/TweenMax';

import { Move } from '../../move';
import { Position } from '../../position';
import { Dance } from '../../dance';
import { SnakeToCamelPipe } from '../../snakeToCamel.pipe';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})

export class AnimationComponent implements OnInit, OnChanges {
  @Input() steps:Array<Move|Position>;
  @Input() moves:Array<Move>;
  @Input() positions:Array<Position>;

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
  couplesOut:boolean = true
  // @Input() danceId:number;
  danceData:Dance
  @Input() currentDance:Dance

  constructor(private el: ElementRef, private nameConverter:SnakeToCamelPipe, private apiService:ApiService) { }

  ngOnInit() {
    // this.improperFormation();
    // let startPos = this.becket(3);
    // this.californiaTwirlUpAndDown(startPos)
    // let nextPos = this.improperProgressed(0);
    // this.swingOnSidesOfSet(nextPos)
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) { // change to for the changes.steps
      if (propName === "this.steps") {
        const change = changes[propName];
        console.log(change)
        if (!change.firstChange) {
          console.log(change.currentValue)

          console.log(change.currentValue) // Was list of steps, then was Id of dance, then was danceData

          // Get steps (dance_moves) for dance, convert into positions and moves
          let positions:Array<Position> = [];
          let moves:Array<Move> = [];
          // this.apiService.getSteps(this.danceId).subscribe((stepsData) => {
          //   console.log(stepsData) // array of objects
          //   stepsData.forEach(function(danceStep, index) {
          //     if (index === 0) {
          //       positions.push(new Position(danceStep.id, true, danceStep['description']))
          //     } else if (index % 2 === 1) {
          //       moves.push(new Move(danceStep.id, danceStep['name']))
          //     } else if (index % 2 === 0) {
          //       positions.push(new Position(danceStep.id, false, danceStep['description']))
          //     }
          //   })
          // })

          console.log(positions[0])
          // run the formation method to set up dancers at start of dance
          this[this.nameConverter.transform(positions[0].description) + "Formation"]()

          let danceTimeline = new TimelineMax({})

          for (let progIndex = 0; progIndex < 3; ++progIndex) {
            console.log(progIndex)
            moves.forEach(function(move, moveIndex) {
              console.log("beginning of loop, moveIndex is: ", moveIndex)

              // obtain moveMethod name and position Method name, check whether they both exist as functions
              let moveMethod = this[this.nameConverter.transform(move.name)]
              let rubyPositionName = positions[moveIndex].description.toString()
              let positionName = this.nameConverter.transform(rubyPositionName);
              if (typeof moveMethod === 'function' && typeof this[positionName] === 'function' ) {
                let moveStartPositionGenerator = this[positionName](progIndex); // progIndex meaning how far red has gotten away from home position (how many times the dance has progressed)

                // // Is move the last move? IE is it the progression?
                if (moveIndex === moves.length - 1) {
                  console.log("hit place in code where move is a progression")
                  this.toggleCouplesOut()

                  // strip startPos arrays of out birds (depending on value of outCouplesWaitingPosition:
                  // improper, becket, etc )
                  if (this.couplesOut) {
                    let strippedData: any =
                    {
                    "birdsLocation": {"nEBirds" : [ElementRef],
                                      "sEBirds" : [ElementRef],
                                      "sWBirds" : [ElementRef],
                                      "nWBirds" : [ElementRef]
                                     },
                    "newlyOutBirds" : { "nE" : ElementRef, "sE" : ElementRef, "sW" : ElementRef, "nW" : ElementRef}
                    }
                    if (moveStartPositionGenerator.outCouplesWaitingPosition === "improper") {
                      strippedData.newlyOutBirds.nE = moveStartPositionGenerator.nEBirds.shift()
                      strippedData.newlyOutBirds.sE = moveStartPositionGenerator.sEBirds.shift()
                      strippedData.newlyOutBirds.sW = moveStartPositionGenerator.sWBirds.pop()
                      strippedData.newlyOutBirds.nW = moveStartPositionGenerator.nWBirds.pop()
                      strippedData.birdsLocation.nEBirds = moveStartPositionGenerator.nEBirds
                      strippedData.birdsLocation.sEBirds = moveStartPositionGenerator.sEBirds
                      strippedData.birdsLocation.sWBirds = moveStartPositionGenerator.sWBirds
                      strippedData.birdsLocation.nWBirds = moveStartPositionGenerator.nWBirds
                    } else if (moveStartPositionGenerator.outCouplesWaitingPosition === "becket") {
                      strippedData.newlyOutBirds.nE = moveStartPositionGenerator.nEBirds.pop()
                      strippedData.newlyOutBirds.sE = moveStartPositionGenerator.sEBirds.shift()
                      strippedData.newlyOutBirds.sW = moveStartPositionGenerator.sWBirds.shift()
                      strippedData.newlyOutBirds.nW = moveStartPositionGenerator.nWBirds.pop()
                      strippedData.birdsLocation.nEBirds = moveStartPositionGenerator.nEBirds
                      strippedData.birdsLocation.sEBirds = moveStartPositionGenerator.sEBirds
                      strippedData.birdsLocation.sWBirds = moveStartPositionGenerator.sWBirds
                      strippedData.birdsLocation.nWBirds = moveStartPositionGenerator.nWBirds
                    }
                    // strippedData would look like:
                    // {
                    //    birdsLocation: { nEBirds: [ this.R3, this.R1 ]
                    //                     sEBirds: [ this.L3, this.L1 ]
                    //                     sWBirds: [ this.R6, this.R4 ]
                    //                     nWBirds: [ this.L6, this.L4 ]
                    //                   },
                    //    newlyOutBirds: { nE: this.R5, // Where they are when they first get pushed out
                    //                     sE: this.L5,
                    //                     sW: this.R2,
                    //                     nW: this.L2
                    //                   }
                    // } (but must be generated dynamically)
                    danceTimeline.add(moveMethod(strippedData.birdsLocation, true), "Progression" + progIndex.toString())
                    danceTimeline.add(this.endEffects("improper", strippedData.newlyOutBirds), "Progression" + progIndex.toString()) // TODO: this.endEffects still must be written
                  } else if (!this.couplesOut) { // no couples out
                    danceTimeline.add(moveMethod(moveStartPositionGenerator, true))
                  } else {
                    return null
                  }
                } else { // if move is NOT a progression
                  danceTimeline.add(moveMethod(moveStartPositionGenerator, false))
                }
                console.log(danceTimeline)
              } else {
                danceTimeline.killAll(false, true, false, true) // complete the killed things? kill tweens?  kill delayedCalls? kill timelines?
                console.log("reached")
                return null
              }
              console.log("end of loop, moveIndex is: ", moveIndex)
            }, this)
          }
        }
      }
    }
  }

// FORMATIONS =================================================

  public improperFormation() {
    console.log("hit formation setup");
    let dottedLarks = [this.L5, this.L3, this.L1];
    let solidLarks = [this.L6, this.L4, this.L2];
    let dottedRavens = [this.R5, this.R3, this.R1];
    let solidRavens = [this.R6, this.R4, this.R2];

    dottedLarks.forEach(function(bird, index) {
      let dx = (240*index + 140)
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 220)");
    })
    solidLarks.forEach(function(bird, index) {
      let dx = (240*index + 20)
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 100)");
    })
    dottedRavens.forEach(function(bird, index) {
      let dx = (240*index + 140)
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 100)");
    })
    solidRavens.forEach(function(bird, index) {
      let dx = (240*index + 20)
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 220)");
    })
  }

  public becketFormation() {
    console.log("hit becket setup");
    let dottedLarks = [this.L5, this.L3, this.L1];
    let solidLarks = [this.L6, this.L4, this.L2];
    let dottedRavens = [this.R5, this.R3, this.R1];
    let solidRavens = [this.R6, this.R4, this.R2];

    dottedLarks.forEach(function(bird, index) {
      let dx = (240*index + 20);
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 220)");
    });
    solidLarks.forEach(function(bird, index) {
      let dx = (240*index + 140);
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 100)");
    });
    dottedRavens.forEach(function(bird, index) {
      let dx = (240*index + 140);
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 220)");
    });
    solidRavens.forEach(function(bird, index) {
      let dx = (240*index + 20);
      bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 100)");
    })
  }

// POSITIONS =================================================
  // Takes the progression number (aka where red is: 0 means start of dance, 12 is upper limit where everyone's back where they started), returns where each bird is in order (at prog # = 0, purple birds first, red birds last).
  // Also returns the value of outCouplesWaitingPosition, which has different values: improper, proper, becket, oppositeBecket, or none (for no couples out)
  // Down the line, if there are more than one positions out couples should be in (at first they should be proper for a move with a shadow, then wait improper to go back in), add outCouplesWaitingPosition2 variable

  public improper(progressionNumber:number) {
    console.log("hit POSITION improper")
    let birdsLocation:any = { nEBirds: [this.R5, this.R3, this.R1],
                              sEBirds: [this.L5, this.L3, this.L1],
                              sWBirds: [this.R6, this.R4, this.R2],
                              nWBirds: [this.L6, this.L4, this.L2] }
    for (let prog = 0; prog <= progressionNumber; ++prog) {
      if (prog > 12) {
        return null
      }
      else if (prog % 2 === 0) {
        birdsLocation.outCouplesWaitingPosition = "none"
      } else if (prog % 2 === 1) {
        birdsLocation.outCouplesWaitingPosition = "improper"
        let newNE = birdsLocation.sWBirds.pop();
        let newSE = birdsLocation.nWBirds.pop();
        birdsLocation.nEBirds.push(newNE);
        birdsLocation.sEBirds.push(newSE);
        let newSW = birdsLocation.nEBirds.shift();
        let newNW = birdsLocation.sEBirds.shift();
        birdsLocation.sWBirds.unshift(newSW);
        birdsLocation.nWBirds.unshift(newNW);
      } else { return null }
    }
    return birdsLocation;
  }

  public becket(progressionNumber:number) {
    console.log("hit POSITION becket")
    let birdsLocation:any = { nEBirds: [this.L6, this.L4, this.L2],
                              sEBirds: [this.R5, this.R3, this.R1],
                              sWBirds: [this.L5, this.L3, this.L1],
                              nWBirds: [this.R6, this.R4, this.R2] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog % 2 === 0) {
        birdsLocation.outCouplesWaitingPosition = "none"
      } else if (prog % 2 === 1) {
        birdsLocation.outCouplesWaitingPosition = "becket"
        let newNE = birdsLocation.sWBirds.shift();
        let newSE = birdsLocation.nWBirds.pop();
        let newSW = birdsLocation.nEBirds.pop();
        let newNW = birdsLocation.sEBirds.shift();
        birdsLocation.nEBirds.unshift(newNE)
        birdsLocation.sEBirds.push(newSE)
        birdsLocation.sWBirds.push(newSW)
        birdsLocation.nWBirds.unshift(newNW)
      } else { return null }
    }
    return birdsLocation
  }

  public oppositeBecket(progressionNumber:number) {
    console.log("hit POSITION oppositeBecket")
    let birdsLocation:any = { nEBirds: [this.L5, this.L3, this.L1],
                              sEBirds: [this.R6, this.R4, this.R2],
                              sWBirds: [this.L6, this.L4, this.L2],
                              nWBirds: [this.R5, this.R3, this.R1] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
        birdsLocation.outCouplesWaitingPosition = "none"
      } else if (prog % 2 === 1) {
        birdsLocation.outCouplesWaitingPosition = "oppositeBecket"
        let newNE = birdsLocation.sWBirds.pop();
        let newSE = birdsLocation.nWBirds.shift();
        let newSW = birdsLocation.nEBirds.shift();
        let newNW = birdsLocation.sEBirds.pop();
        birdsLocation.nEBirds.push(newNE)
        birdsLocation.sEBirds.unshift(newSE)
        birdsLocation.sWBirds.unshift(newSW)
        birdsLocation.nWBirds.push(newNW)
      } else if (prog % 2 === 0) {
        birdsLocation.outCouplesWaitingPosition = "none"
      } else { return null }
    }
    return birdsLocation
  }

  public improperProgressed(progressionNumber:number) {
    console.log("hit POSITION improperProgressed")
    let birdsLocation:any = { nEBirds: [this.R6, this.R4, this.R2],
                              sEBirds: [this.L6, this.L4, this.L2],
                              sWBirds: [this.R5, this.R3, this.R1],
                              nWBirds: [this.L5, this.L3, this.L1] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
        birdsLocation.outCouplesWaitingPosition = "none"
      } else if (prog % 2 === 1) {
        birdsLocation.outCouplesWaitingPosition = "improper"
        let newNE = birdsLocation.nWBirds.shift();
        let newSE = birdsLocation.sWBirds.shift();
        let newSW = birdsLocation.sEBirds.pop();
        let newNW = birdsLocation.nEBirds.pop();
        birdsLocation.nEBirds.unshift(newNE)
        birdsLocation.sEBirds.unshift(newSE)
        birdsLocation.sWBirds.push(newSW)
        birdsLocation.nWBirds.push(newNW)
      } else if (prog % 2 === 0) {
        birdsLocation.outCouplesWaitingPosition = "none"
        let newNE = birdsLocation.sEBirds.shift();
        let newSE = birdsLocation.nEBirds.shift();
        let newSW = birdsLocation.nWBirds.pop();
        let newNW = birdsLocation.sWBirds.pop();
        birdsLocation.nEBirds.unshift(newNE)
        birdsLocation.sEBirds.unshift(newSE)
        birdsLocation.sWBirds.push(newSW)
        birdsLocation.nWBirds.push(newNW)
      }
    }
    return birdsLocation
  }

  public sideOfSetWithNeighborOnesFacingDown(progressionNumber: number) {
    // note that if and when out couples exist, they must wait proper
    console.log("hit POSITION sideOfSetWithNeighborOnesFacingDown")
    let birdsLocation:any = { nEBirds: [this.L5, this.L3, this.L1],
                              sEBirds: [this.R5, this.R3, this.R1],
                              sWBirds: [this.L6, this.L4, this.L2],
                              nWBirds: [this.R6, this.R4, this.R2] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
        birdsLocation.outCouplesWaitingPosition = "none";
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
        birdsLocation.outCouplesWaitingPosition = "proper"
        let newNE = birdsLocation.sWBirds.pop();
        let newSE = birdsLocation.nWBirds.pop();
        let newSW = birdsLocation.nEBirds.shift();
        let newNW = birdsLocation.sEBirds.shift();
        birdsLocation.nEBirds.push(newNE)
        birdsLocation.sEBirds.push(newSE)
        birdsLocation.sWBirds.unshift(newSW)
        birdsLocation.nWBirds.unshift(newNW)
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
        birdsLocation.outCouplesWaitingPosition = "none"
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

// MOVES =================================================
// Define Moves
/// Moves need to know:
// - birdsLocation (startPos), which is comprised of: a) h4Birds:{[nEBirds], [sEBirds], [sWBirds], [nWBirds]}, b) outBirds: null OR {neOutBird, sEOutBird, sWOutBird, nWOutBird}, c) outCoupl
// - shouldOutCouplesAnimate (true iff moveIndex = 1)
// - whether couples are out, and if so, what position they should wait in?
// - is the move a progression?
// New: just startPos and couplesOut:boolean
// Instead of the animating move updating the birdsLocation varible, it will just animate

  public balanceTheRing = (startPos, isProgression:boolean) => {
    console.log("hit MOVE balanceTheRing")

    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();
    // // out couples need animating too!
    // let eeTl = new TimelineMax();

    startPos.nEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "-=40", y: "+=40"})
        .to(bird.nativeElement, 1, {x: "+=40", y: "-=40"})
      nETl.add(tl, 0)
    })
    startPos.sEBirds.map(function(bird, i){
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "-=40", y: "-=40"})
        .to(bird.nativeElement, 1, {x: "+=40", y: "+=40"})
        sETl.add(tl, 0)
    })
    startPos.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "+=40", y: "-=40"})
        .to(bird.nativeElement, 1, {x: "-=40", y: "+=40"})
        sWTl.add(tl, 0)
    })
    startPos.nWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "+=40", y: "+=40"})
        .to(bird.nativeElement, 1, {x: "-=40", y: "-=40"})
        nWTl.add(tl, 0)
    })

    // if (this.checkForOutCouples(startPos)) {
    //   let outNE, outSE, outSW, outNW
    //   if (startPos.outCouplesWaitingPosition === "improper") {
    //     outNE = startPos.nEBirds.shift()
    //     outSE = startPos.sEBirds.shift()
    //     outSW = startPos.sWBirds.pop()
    //     outNW = startPos.nWBirds.pop()
    //     eeTl.add(this.improperEE(outNE, outSE, outSW, outNW), 0)
    //   } else if (startPos.outCouplesWaitingPosition === "proper") {
    //     outNE = startPos.
    //   }
    // }

    return [nETl, sETl, sWTl, nWTl]
  }

  public petronella(startPos, isProgression:boolean) {
    console.log("hit MOVE petronella")
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();
    let eeTl = new TimelineMax();

    startPos.nEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {x: "-=120"})
      nETl.add(tl, 0)
    })
    startPos.sEBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {y: "-=120"})
      sETl.add(tl, 0)
    })
    startPos.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {x: "+=120"})
      sWTl.add(tl, 0)
    })
    startPos.nWBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {y: "+=120"})
      nWTl.add(tl, 0)
    })
    // if (this.checkForOutCouples(startPos)) {
    //   let outNE, outSE, outSW, outNW
    //   if (startPos.outCouplesWaitingPosition === "improper") {
    //     outNE = startPos.nEBirds.shift()
    //     outSE = startPos.sEBirds.shift()
    //     outSW = startPos.sWBirds.pop()
    //     outNW = startPos.nWBirds.pop()
    //     eeTl.add(this.improperEE(outNE, outSE, outSW, outNW), 0)
    //   } else if (startPos.outCouplesWaitingPosition === "proper") {
    //
    //   }
    //
    // }
    return [nETl, sETl, sWTl, nWTl]
  }

  public swingOnSidesOfSet(startPos, isProgression:boolean) {
    console.log("Hit MOVE swingOnSidesOfSet")
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();

    startPos.sEBirds.map(function(sEBird, i) {
      let tl = new TimelineMax();
      tl.to(sEBird.nativeElement, 0.4, {x: "-=40", y: "+=20"})
      if (sEBird.nativeElement.id[0] === 'L') {
        tl.to(sEBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i + 80 + "px 220px"})
          .to(sEBird.nativeElement, 0.4, {x: "-=40", y: "-=20"})
      } else if (sEBird.nativeElement.id[0] === 'R') {
        tl.to(sEBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i + 80 + "px 220px"})
          .to(sEBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      }
      sETl.add(tl, 0)
    })
    startPos.sWBirds.map(function(sWBird, i) {
      let tl = new TimelineMax();
      tl.to(sWBird.nativeElement, 0.4, {x: "+=40", y: "-=20"})
      if (sWBird.nativeElement.id[0] === 'R') {
        tl.to(sWBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+80 + "px 220px"})
          .to(sWBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      } else if (sWBird.nativeElement.id[0] === 'L') {
        tl.to(sWBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i+80 + "px 220px"})
          .to(sWBird.nativeElement, 0.4, {x:"-=40", y: "-=20"})
      }
      sWTl.add(tl, 0)
    })
    startPos.nWBirds.map(function(nWBird, i) {
      let tl = new TimelineMax();
      tl.to(nWBird.nativeElement, 0.4, {x: "+=40", y:"-=20"})
      if (nWBird.nativeElement.id[0] === 'L') {
        tl.to(nWBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+80 + "px 100px"})
          .to(nWBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      } else if (nWBird.nativeElement.id[0] === 'R') {
        tl.to(nWBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i+80 + "px 100px"})
          .to(nWBird.nativeElement, 0.4, {x: "-=40", y: "-=20"})
      }
      nWTl.add(tl, 0)
    })
    startPos.nEBirds.map(function(nEBird, i) {
      let tl = new TimelineMax();
      tl.to(nEBird.nativeElement, 0.4, {x: "-=40", y: "+=20"})
      if (nEBird.nativeElement.id[0] === 'R') {
        tl.to(nEBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+80 + "px 100"})
          .to(nEBird.nativeElement, 0.4, {x: "-=40", y: "-=20"})
      } else if (nEBird.nativeElement.id[0] === 'L') {
        tl.to(nEBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i+80 + "px 100"})
          .to(nEBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      }
      nETl.add(tl, 0)
    })
    return [nETl, sETl, sWTl, nWTl]
  }

  public dancersOnRightRightShoulderRoundOnceAndAHalf(startPos, isProgression:boolean) {
    console.log("Hit MOVE dancersOnRightRightShoulderRoundOnceAndAHalf")
    let sETl = new TimelineMax();
    let nWTl = new TimelineMax();

    startPos.sEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x: "-=80", y:"-=40"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+80 + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "-=40", y: "-=40"})
      sETl.add(tl, 0)
    })
    startPos.nWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x:"+=80", y:"+=40"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+80 + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "+=40", y: "+=40"})
      nWTl.add(tl, 0)
    })
    return [sETl, nWTl]
  }

  public dancersOnLeftRightShoulderRoundOnceAndAHalf(startPos, isProgression:boolean) {
    console.log("Hit MOVE dancersOnLeftRightShoulderRoundOnceAndAHalf")
    let sWTl = new TimelineMax();
    let nETl = new TimelineMax();

    startPos.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x: "+=40", y:"-=80"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+80 + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "+=40", y: "-=40"})
      sWTl.add(tl, 0)
    })
    startPos.nEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x:"-=40", y:"+=80"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+80 + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "-=40", y: "+=40"})
      nETl.add(tl, 0)
    })
    return [nETl, sWTl]
  }

  public circleLeftThreeQuarters(startPos, isProgression:boolean) {
    console.log("Hit MOVE circleLeftThreeQuarters")
    let moveTl = new TimelineMax();
    const birdsInArrayByCardinalPositioning = [startPos.nEBirds, startPos.sEBirds, startPos.sWBirds, startPos.nWBirds]
    birdsInArrayByCardinalPositioning.map(function(birdsByCarinalPosition) {
      birdsByCarinalPosition.map(function(bird, i) {
        let tl = new TimelineMax();
        tl.to(bird.nativeElement, 2, {rotation: "+=270", svgOrigin: 240*i+80 + "px 160px"})
        moveTl.add(tl, 0)
      })
    })
    return moveTl
  }

  public californiaTwirlUpAndDown(startPos, isProgression:boolean) {
    console.log("Hit MOVE californiaTwirl")
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();

    startPos.nWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i-20 + "px 140px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "+=40"})
      } else if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i-20 + "px 140px"})
          .to(bird.nativeElement, 0.8, {y: "+=40"}, "+=0.6")
      }
      nWTl.add(tl, 0)
    })
    startPos.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i-20 + "px 180px"})
          .to(bird.nativeElement, 0.8, {y: "-=40"}, "+=0.6")
      } else if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i-20 + "px 180px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "-=40"})
      }
      sWTl.add(tl, 0)
    })
    startPos.nEBirds.map(function(bird,i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i+100 + "px 140px"})
          .to(bird.nativeElement, 0.8, {y: "+=40"}, "+=0.6")
      } else if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i+100 + "px 140px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "+=40"})
      }
      nETl.add(tl, 0)
    })
    startPos.sEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i+100 + "px 180px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "-=40"})
      } else if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i+100 + "px 180px"})
          .to(bird.nativeElement, 0.8, {y: "-=40"}, "+=0.6")
      }
      sETl.add(tl, 0)
    })
    return [nETl, sETl, sWTl, nWTl]
  }

// END EFFECTS ANIMATIONS ===================================
// Methods which will be called in the moves
// Will return a timeline that each move will add at 0 seconds
// Will take which bird is nE, which is sE, sW, nW (this will be the position each bird will wait in (at the end of the animation))

  public improperEE(nE, sE, sW, nW) {
    let tl = new TimelineMax();
    tl.to(nW.nativeElement, 2, {rotation: "-=90", svgOrigin: "560px 160px"}, 0)
      .to(sW.nativeElement, 2, {rotation: "+=90", svgOrigin: "560px 160px"}, 0)
      .to(nE.nativeElement, 2, {rotation: "+=90", svgOrigin: "80px 160px"}, 0)
      .to(sE.nativeElement, 2, {rotation: "-=90", svgOrigin: "80px 160px"}, 0)
    return tl
  }


// Miscellaneous Methods ==================================

  public strippedBirdsLocations(startPos) {
    // should eventually be it's own method
  }

  public toggleCouplesOut() {
    if (this.couplesOut === true) {
      this.couplesOut = false;
    } else if (this.couplesOut === false) {
      this.couplesOut = true;
    }
  }

  public endEffects(type:string, originalPositiosOfNewlyOutBirds) {
    // must return timeline
    console.log("Hit method endEffects()")
    let tl = new TimelineMax();
    if (type === "improper") {
      console.log(originalPositiosOfNewlyOutBirds.nE.nativeElement, originalPositiosOfNewlyOutBirds.sW.nativeElement)
      tl.to(originalPositiosOfNewlyOutBirds.nE.nativeElement, 2, {rotation: "-=90", svgOrigin: "80px 160px"}, 0)
        .to(originalPositiosOfNewlyOutBirds.sE.nativeElement, 2, {rotation: "+=90", svgOrigin: "80px 160px"}, 0)
        .to(originalPositiosOfNewlyOutBirds.sW.nativeElement, 2, {rotation: "-=90", svgOrigin: "560px 160px"}, 0)
        .to(originalPositiosOfNewlyOutBirds.nW.nativeElement, 2, {rotation: "+=90", svgOrigin: "560px 160px"}, 0)
      return tl
    } else if (type === "becket") { // TODO: svgOrigin needs updating after viewport/viewbox? is increased (not svg size but area to view it in)
      tl.to(originalPositiosOfNewlyOutBirds.nE.nativeElement, 2, {rotation: "+=90", svgOrigin: "580px 160px"}, 0)
        .to(originalPositiosOfNewlyOutBirds.sE.nativeElement, 2, {rotation: "+=90", svgOrigin: "60px 160px"})
        .to(originalPositiosOfNewlyOutBirds.sW.nativeElement, 2, {rotation: "+=90", svgOrigin: "60px 160px"})
        .to(originalPositiosOfNewlyOutBirds.nW.nativeElement, 2, {rotation: "+=90", svgOrigin: "580px 160px"})
      return tl
    }
  }
}

  // public checkForOutCouples(startPos) {
  //   if (startPos.outCouplesWaitingPosition === "none") {
  //      return false;
  //   } else {
  //     return true;
  //   }
  // }


// // !!!!DON'T DELETE!!!!
// console.log(bird.nativeElement.getBoundingClientRect().x) // origin?
// console.log(bird.nativeElement.getClientRects()[0].x)
// console.log(bird.nativeElement.getBoundingClientRect().left) // top corner x axis value
// console.log(bird.nativeElement.getClientRects()[0].left)
//
// console.log(bird.nativeElement.getBoundingClientRect().y) // origin?
// console.log(bird.nativeElement.getClientRects()[0].y)
// console.log(bird.nativeElement.getBoundingClientRect().top) // left corner y axis value
// console.log(bird.nativeElement.getClientRects()[0].top)
