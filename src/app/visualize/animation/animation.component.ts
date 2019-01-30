import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { TweenLite, TweenMax, TimelineMax, CSSPlugin } from 'gsap/TweenMax';

import { Move } from '../../move';
import { Position } from '../../position';
import { Dance } from '../../dance';
import { DanceMove } from '../../danceMove'
import { SnakeToCamelPipe } from '../../snakeToCamel.pipe';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})

export class AnimationComponent implements OnInit, OnChanges {

  // @Input() steps:Array<Move|Position>;
  @Input() danceMoves;
  @Input() danceFormation:Position;
  @Input() formation:string;

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
  // couplesOut:boolean = true // calculate this instead in ngOnChanges by even or oddness of progNumber
  // @Input() danceId:number;
  @Input() currentDance:Dance //

  constructor(private el: ElementRef, private nameConverter:SnakeToCamelPipe, private apiService:ApiService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)

    for (const propName of Object.keys(changes)) {
      const change = changes[propName];

      // if steps have changed and its not the initial page load
      if (propName === "danceMoves" && !change.firstChange) {

        console.log(change.currentValue) // Is array of danceMoves

        let danceTimeline = new TimelineMax({})
        let birdsLoc

        // set up formation, visually and for birdsLoc value
        birdsLoc = this[this.formation + "Formation"](); // Get birdsLocation from formation method

        // Loop through 12 full iterations of the dance
        for (let progIndex = 0; progIndex < 12; progIndex++) {

          // Loop through all dance moves during each full iterations
          this.danceMoves.forEach(function(danceMove) {

            // setup
            /// Obtain moveMethod: method which returns each move's animation
            /// Obtain position name (called from Rails API, written in camel_case)
            /// Obtain position Method name (written in snakeCase)
            let moveMethod = this[this.nameConverter.transform(danceMove.move.name)]
            let rubyPositionName = danceMove.endingPosition.description.toString()
            let endingPositionName = this.nameConverter.transform(rubyPositionName);

            // check whether both methods exist as functions (are all new moves and positions hard-coded yet?)
            if (typeof moveMethod === 'function' && typeof this[endingPositionName] === 'function' ) {

              // if the danceMove is a regular move (ie, NOT a progression)
              if (!danceMove.isProgression) {
                // Using the prior birdLoc, add the move (first - BTR) to the TL
                danceTimeline.add(moveMethod(birdsLoc));

                // Now, recalculate birdsLoc using danceMove.endingPosition (improper, progIndex = 0)
                birdsLoc = this[endingPositionName](progIndex);

              }

              // else if the move is a progression
              //// ??? THEN, the Minute after the move happens, the length of h4 switches (right after the move, we need to sendCouplesOut, or incorportate them.)
              ////// This may be a good point, and a clue to refactoring: When does the length of h4 shift? After progression move, but before that move's ending position? After the prog_move and its end_pos? Depending on the answer, i may need to refactor the seed file: The cali twirl may end in impropor or in sOSw/N,1sFDown, depending on the answer
              else if (danceMove.isProgression) {
                console.log("reached progression")

                // For every progression: animate the progression move (giving it the label: ProgressionN), then get the endingPosition of the progressionMove
                danceTimeline.add(moveMethod(birdsLoc), "Progression" + progIndex.toString());
                birdsLoc = this[endingPositionName](progIndex)

                // ??? (Dance has not yet progressed. progIndex = 0. move is caliTwirl. This move's ending position is improper, but it is _improper(1)_)

                // If statement based on whether birds are out
                /// if NO couples are out, couples need to be sent out
                // if it's a send-couples-out progression,
                if (progIndex % 2 === 0) {  // Alternatively, could we say: if (Object.keys(birdsLoc.outBirds).length === 0)

                  // update birdsLoc
                  birdsLoc = this.sendCouplesOutPerpendicular(birdsLoc) // will need to later be dynamic depending on how couples wait out


                  // Why on earth are the next two lines in the order they're in currently? Seems counter-inituitve to the way it's usually done (1st a move takes the current bL, then 2nd we calculate the endingPos based on progIndex and independently of prior birdsLoc) <<--- TODO: re-program end effects position and move/animation methods to be analagous
                  birdsLoc = this.crossoverPerpendicular(birdsLoc)
                  danceTimeline.add(this.crossoverPerpendicularAnimation(birdsLoc), "Progression" + progIndex.toString() + "+=2")

                /// if couples ARE out, they need to come back in
                // if it's an incorporate-out-couples progression
                } else if (progIndex % 2 === 1) {
                  birdsLoc = this.incorporateOutCouplesPerpendicular(birdsLoc)
                }

              }

            // if either the move or position hasn't been coded yet
            } else {
              danceTimeline.killAll(false, true, false, true) // complete the killed things? kill tweens?  kill delayedCalls? kill timelines?
              console.log("reached")
              return null
            }
          }, this)
        }
      }
    }
  }

// FORMATIONS =================================================
/// Shows dancers on page as static circles

  public improperFormation() {
    console.log("hit formation setup");
    let birdsLocation:any = { h4Birds: {nEBirds: [this.R5, this.R3, this.R1],
                                        sEBirds: [this.L5, this.L3, this.L1],
                                        sWBirds: [this.R6, this.R4, this.R2],
                                        nWBirds: [this.L6, this.L4, this.L2]},
                              outBirds: {}
                             }

    birdsLocation.h4Birds.nEBirds.forEach(function(bird, index) {
      let dx = (240*index + 140).toString() + 'px'
      bird.nativeElement.style.cx = dx;
      bird.nativeElement.style.cy = '100px';
    })
    birdsLocation.h4Birds.sEBirds.forEach(function(bird, index) {
      let dx = (240*index + 140).toString() + 'px'
      bird.nativeElement.style.cx = dx;
      bird.nativeElement.style.cy = '220px';
    })
    birdsLocation.h4Birds.sWBirds.forEach(function(bird, index) {
      let dx = (240*index + 20).toString() + 'px'
      bird.nativeElement.style.cx = dx;
      bird.nativeElement.style.cy = '220px';
    })
    birdsLocation.h4Birds.nWBirds.forEach(function(bird, index) {
      let dx = (240*index + 20).toString() + 'px'
      bird.nativeElement.style.cx = dx;
      bird.nativeElement.style.cy = '100px';
    })


    return birdsLocation
  }

  public becketFormation() {
    console.log("hit becket setup");
    let birdsLocation:any = { h4Birds: {nEBirds: [this.L6, this.L4, this.L2],
                                        sEBirds: [this.R5, this.R3, this.R1],
                                        sWBirds: [this.L5, this.L3, this.L1],
                                        nWBirds: [this.R6, this.R4, this.R2]},
                              outBirds: {}
                            }
    // The following needs refactoring to use birdsLocation instead

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
    return birdsLocation
  }

// POSITIONS =================================================
  // Takes the progression number (aka where red is: 0 means start of dance, 12 is upper limit where everyone's back where they started), returns where each bird is in order (at prog # = 0, purple birds first, red birds last).
  // Also returns the value of outCouplesWaitingPosition, which has different values: improper, proper, becket, oppositeBecket, or none (for no couples out)
  // Down the line, if there are more than one positions out couples should be in (at first they should be proper for a move with a shadow, then wait improper to go back in), add outCouplesWaitingPosition2 variable

  public improper(progressionNumber:number) {
    console.log("hit POSITION improper")
    let birdsLocation:any = { h4Birds: {nEBirds: [this.R5, this.R3, this.R1],
                                        sEBirds: [this.L5, this.L3, this.L1],
                                        sWBirds: [this.R6, this.R4, this.R2],
                                        nWBirds: [this.L6, this.L4, this.L2]},
                              outBirds: {}
                             }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      } else if (prog === 0) {
      } else if (prog % 2 === 1) {
        birdsLocation.outBirds.nEBird = birdsLocation.h4Birds.nWBirds.pop();
        birdsLocation.outBirds.sEBird = birdsLocation.h4Birds.sWBirds.pop();
        birdsLocation.outBirds.sWBird = birdsLocation.h4Birds.sEBirds.shift();
        birdsLocation.outBirds.nWBird = birdsLocation.h4Birds.nEBirds.shift();
      } else if (prog % 2 === 0) {
        // Currently, I am pushing and unshifting the values from position(progIndex before this), not from the crossedover Values. (I think this is correct)
        birdsLocation.h4Birds.nEBirds.push(birdsLocation.outBirds.sEBird)
        birdsLocation.h4Birds.sEBirds.push(birdsLocation.outBirds.nEBird)
        birdsLocation.h4Birds.sWBirds.unshift(birdsLocation.outBirds.nWBird)
        birdsLocation.h4Birds.nWBirds.unshift(birdsLocation.outBirds.sWBird)
        birdsLocation.outBirds = {}
      } else { return null }
    }
    return birdsLocation;
  }

  public becket(progressionNumber:number) {
    console.log("hit POSITION becket");
    let birdsLocation:any = { h4Birds: {nEBirds: [this.L6, this.L4, this.L2],
                                        sEBirds: [this.R5, this.R3, this.R1],
                                        sWBirds: [this.L5, this.L3, this.L1],
                                        nWBirds: [this.R6, this.R4, this.R2]},
                              outBirds: {}
                            }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      } else if (prog === 0) {
      } else if (prog % 2 === 1) {
        birdsLocation.outBirds.nEBird = birdsLocation.h4Birds.nEBirds.pop();
        birdsLocation.outBirds.sEBird = birdsLocation.h4Birds.sEBirds.shift();
        birdsLocation.outBirds.sWBird = birdsLocation.h4Birds.nWBirds.shift();
        birdsLocation.outBirds.nWBird = birdsLocation.h4Birds.nWBirds.pop();
      } else if (prog % 2 === 0) {
        birdsLocation.h4Birds.nEBirds.unshift(birdsLocation.outBirds.sWBird)
        birdsLocation.h4Birds.sEBirds.push(birdsLocation.outBirds.nWBird)
        birdsLocation.h4Birds.sWBirds.push(birdsLocation.outBirds.nEBird)
        birdsLocation.h4Birds.nWBirds.unshift(birdsLocation.outBirds.sEBird)
        birdsLocation.outBirds = {}
      } else { return null }
    }
    return birdsLocation
  }

  public oppositeBecket(progressionNumber:number) {
    console.log("hit POSITION oppositeBecket");
    let birdsLocation:any = { h4Birds: {nEBirds: [this.L5, this.L3, this.L1],
                                        sEBirds: [this.R6, this.R4, this.R2],
                                        sWBirds: [this.L6, this.L4, this.L2],
                                        nWBirds: [this.R5, this.R3, this.R1]},
                              outBirds: {}
                            }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      } else if (prog === 0) {
      } else if (prog % 2 === 1) {
        birdsLocation.outBirds.nEBird = birdsLocation.h4Birds.nEBirds.shift()
        birdsLocation.outBirds.sEBird = birdsLocation.h4Birds.sEBirds.pop()
        birdsLocation.outBirds.sWBird = birdsLocation.h4Birds.sWBirds.pop()
        birdsLocation.outBirds.nWBird = birdsLocation.h4Birds.nWBirds.shift()
      } else if (prog % 2 === 0) {
        birdsLocation.h4Birds.nEBirds.push(birdsLocation.outBirds.sWBird)
        birdsLocation.h4Birds.sEBirds.unshift(birdsLocation.outBirds.nWBird)
        birdsLocation.h4Birds.sWBirds.unshift(birdsLocation.outBirds.nEBird)
        birdsLocation.h4Birds.nWBirds.push(birdsLocation.outBirds.sEBird)
        birdsLocation.outBirds = {}
      } else { return null }
    }
    return birdsLocation
  }

  public improperProgressed(progressionNumber:number) {
    console.log("hit POSITION improperProgressed");
    let birdsLocation:any = { h4Birds: {nEBirds: [this.R6, this.R4, this.R2],
                                        sEBirds: [this.L6, this.L4, this.L2],
                                        sWBirds: [this.R5, this.R3, this.R1],
                                        nWBirds: [this.L5, this.L3, this.L1]},
                              outBirds: {}
                            }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
      } else if (prog % 2 === 1) {
        birdsLocation.outBirds.nEBird = birdsLocation.h4Birds.nEBirds.pop()
        birdsLocation.outBirds.sEBird = birdsLocation.h4Birds.sEBirds.pop()
        birdsLocation.outBirds.sWBird = birdsLocation.h4Birds.sWBirds.shift()
        birdsLocation.outBirds.nWBird = birdsLocation.h4Birds.nWBirds.shift()
      } else if (prog % 2 === 0) {
        birdsLocation.h4Birds.nEBirds.unshift(birdsLocation.outBirds.sWBird)
        birdsLocation.h4Birds.sEBirds.unshift(birdsLocation.outBirds.nWBird)
        birdsLocation.h4Birds.sWBirds.push(birdsLocation.outBirds.nEBird)
        birdsLocation.h4Birds.nWBirds.push(birdsLocation.outBirds.sEBird)
        birdsLocation.outBirds = {}
      }
    }
    return birdsLocation
  }

  public sideOfSetWithNeighborOnesFacingDown(progressionNumber: number) {
    // note that if and when out couples exist, they must wait proper
    console.log("hit POSITION sideOfSetWithNeighborOnesFacingDown")
    let birdsLocation:any = { h4Birds: {nEBirds: [this.L5, this.L3, this.L1],
                                        sEBirds: [this.R5, this.R3, this.R1],
                                        sWBirds: [this.L6, this.L4, this.L2],
                                        nWBirds: [this.R6, this.R4, this.R2]},
                              outBirds: {}
                            }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      } else if (prog === 0) {
      } else if (prog % 2 === 1) {
        birdsLocation.outBirds.nEBird = birdsLocation.h4Birds.nWBirds.pop()
        birdsLocation.outBirds.sEBird = birdsLocation.h4Birds.sWBirds.pop()
        birdsLocation.outBirds.sWBird = birdsLocation.h4Birds.sEBirds.shift()
        birdsLocation.outBirds.nWBird = birdsLocation.h4Birds.nEBirds.shift()
      } else if (prog % 2 === 0) {
        birdsLocation.h4Birds.nEBirds.push(birdsLocation.outBirds.sEBird)
        birdsLocation.h4Birds.sEBirds.push(birdsLocation.outBirds.nEBird)
        birdsLocation.h4Birds.sWBirds.unshift(birdsLocation.outBirds.nWBird)
        birdsLocation.h4Birds.nWBirds.unshift(birdsLocation.outBirds.sWBird)
        birdsLocation.outBirds = {}
      } else { return null }
    }
    return birdsLocation
  }

// MOVES =================================================
// Define Moves
/// Moves need to know:
// - birdsLocation (startPos), which is comprised of: a) h4Birds:{[nEBirds], [sEBirds], [sWBirds], [nWBirds]}, b) outBirds: null OR {neOutBird, sEOutBird, sWOutBird, nWOutBird}, c) outCoupl
// - is the move a progression?
// Instead of the animating move and updating the birdsLocation varible, it will just animate

// Regular Moves ==========

  public balanceTheRing(startPos) {
    console.log("hit MOVE balanceTheRing")

    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();

    startPos.h4Birds.nEBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "-=40", y: "+=40"})
        .to(bird.nativeElement, 1, {x: "+=40", y: "-=40"})
      nETl.add(tl, 0)
    })
    startPos.h4Birds.sEBirds.map(function(bird){
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "-=40", y: "-=40"})
        .to(bird.nativeElement, 1, {x: "+=40", y: "+=40"})
        sETl.add(tl, 0)
    })
    startPos.h4Birds.sWBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "+=40", y: "-=40"})
        .to(bird.nativeElement, 1, {x: "-=40", y: "+=40"})
        sWTl.add(tl, 0)
    })
    startPos.h4Birds.nWBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 1, {x: "+=40", y: "+=40"})
        .to(bird.nativeElement, 1, {x: "-=40", y: "-=40"})
        nWTl.add(tl, 0)
    })
    return [nETl, sETl, sWTl, nWTl]
  }

  public petronella(startPos) {
    console.log("hit MOVE petronella")
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();
    let eeTl = new TimelineMax();

    startPos.h4Birds.nEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {x: "-=120"})
      nETl.add(tl, 0)
    })
    startPos.h4Birds.sEBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {y: "-=120"})
      sETl.add(tl, 0)
    })
    startPos.h4Birds.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {x: "+=120"})
      sWTl.add(tl, 0)
    })
    startPos.h4Birds.nWBirds.map(function(bird) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 2, {y: "+=120"})
      nWTl.add(tl, 0)
    })
    return [nETl, sETl, sWTl, nWTl]
  }

  public swingOnSidesOfSet(startPos) {
    console.log("Hit MOVE swingOnSidesOfSet")
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();

    // Set up formula for determining x-value offset (depends on whether couples are out)
    let xOffset
    // if there are couples out
    if ('nEBird' in startPos.outBirds) {
      xOffset = 200;
    } else {// if all couples are in
      xOffset = 80;
    }

    startPos.h4Birds.sEBirds.map(function(sEBird, i) {
      let tl = new TimelineMax();
      tl.to(sEBird.nativeElement, 0.4, {x: "-=40", y: "+=20"})
      if (sEBird.nativeElement.id[0] === 'L') {
        tl.to(sEBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i + xOffset + "px 220px"})
          .to(sEBird.nativeElement, 0.4, {x: "-=40", y: "-=20"})
      } else if (sEBird.nativeElement.id[0] === 'R') {
        tl.to(sEBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i + xOffset + "px 220px"})
          .to(sEBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      }
      sETl.add(tl, 0)
    })
    startPos.h4Birds.sWBirds.map(function(sWBird, i) {
      let tl = new TimelineMax();
      tl.to(sWBird.nativeElement, 0.4, {x: "+=40", y: "-=20"})
      if (sWBird.nativeElement.id[0] === 'R') {
        tl.to(sWBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+xOffset + "px 220px"})
          .to(sWBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      } else if (sWBird.nativeElement.id[0] === 'L') {
        tl.to(sWBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i+xOffset + "px 220px"})
          .to(sWBird.nativeElement, 0.4, {x:"-=40", y: "-=20"})
      }
      sWTl.add(tl, 0)
    })
    startPos.h4Birds.nWBirds.map(function(nWBird, i) {
      let tl = new TimelineMax();
      tl.to(nWBird.nativeElement, 0.4, {x: "+=40", y:"-=20"})
      if (nWBird.nativeElement.id[0] === 'L') {
        tl.to(nWBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+xOffset + "px 100px"})
          .to(nWBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      } else if (nWBird.nativeElement.id[0] === 'R') {
        tl.to(nWBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i+xOffset + "px 100px"})
          .to(nWBird.nativeElement, 0.4, {x: "-=40", y: "-=20"})
      }
      nWTl.add(tl, 0)
    })
    startPos.h4Birds.nEBirds.map(function(nEBird, i) {
      let tl = new TimelineMax();
      tl.to(nEBird.nativeElement, 0.4, {x: "-=40", y: "+=20"})
      if (nEBird.nativeElement.id[0] === 'R') {
        tl.to(nEBird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+xOffset + "px 100"})
          .to(nEBird.nativeElement, 0.4, {x: "-=40", y: "-=20"})
      } else if (nEBird.nativeElement.id[0] === 'L') {
        tl.to(nEBird.nativeElement, 1.2, {rotation: "+=630", svgOrigin: 240*i+xOffset + "px 100"})
          .to(nEBird.nativeElement, 0.4, {x: "+=40", y: "+=20"})
      }
      nETl.add(tl, 0)
    })
    return [nETl, sETl, sWTl, nWTl]
  }

  public dancersOnRightRightShoulderRoundOnceAndAHalf(startPos) {
    console.log("Hit MOVE dancersOnRightRightShoulderRoundOnceAndAHalf")
    let sETl = new TimelineMax();
    let nWTl = new TimelineMax();

    // Set up formula for determining x-value offset (depends on whether couples are out)
    let xOffset
    // if there are couples out
    if ('nEBird' in startPos.outBirds) {
      xOffset = 200;
    } else {// if all couples are in
      xOffset = 80;
    }

    startPos.h4Birds.sEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x: "-=80", y:"-=40"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+xOffset + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "-=40", y: "-=40"})
      sETl.add(tl, 0)
    })
    startPos.h4Birds.nWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x:"+=80", y:"+=40"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+xOffset + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "+=40", y: "+=40"})
      nWTl.add(tl, 0)
    })
    return [sETl, nWTl]
  }

  public dancersOnLeftRightShoulderRoundOnceAndAHalf(startPos) {
    console.log("Hit MOVE dancersOnLeftRightShoulderRoundOnceAndAHalf")
    let sWTl = new TimelineMax();
    let nETl = new TimelineMax();

    // Set up formula for determining x-value offset (depends on whether couples are out)
    let xOffset
    // if there are couples out
    if ('nEBird' in startPos.outBirds) {
      xOffset = 200;
    } else {// if all couples are in
      xOffset = 80;
    }

    startPos.h4Birds.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x: "+=40", y:"-=80"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+xOffset + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "+=40", y: "-=40"})
      sWTl.add(tl, 0)
    })
    startPos.h4Birds.nEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      tl.to(bird.nativeElement, 0.4, {x:"-=40", y:"+=80"})
        .to(bird.nativeElement, 1.2, {rotation: "+=450", svgOrigin: 240*i+xOffset + "px 160px"})
        .to(bird.nativeElement, 0.4, {x: "-=40", y: "+=40"})
      nETl.add(tl, 0)
    })
    return [nETl, sWTl]
  }

  public circleLeftThreeQuarters(startPos) {
    console.log("Hit MOVE circleLeftThreeQuarters")
    let moveTl = new TimelineMax();

    // Set up formula for determining x-value offset (depends on whether couples are out)
    let xOffset
    // if there are couples out
    if ('nEBird' in startPos.outBirds) {
      xOffset = 200;
    } else {// if all couples are in
      xOffset = 80;
    }

    const birdsInArrayByCardinalPositioning = [startPos.h4Birds.nEBirds, startPos.h4Birds.sEBirds, startPos.h4Birds.sWBirds, startPos.h4Birds.nWBirds]
    birdsInArrayByCardinalPositioning.map(function(birdsByCarinalPosition) {
      birdsByCarinalPosition.map(function(bird, i) {
        let tl = new TimelineMax();
        tl.to(bird.nativeElement, 2, {rotation: "+=270", svgOrigin: 240*i+xOffset + "px 160px"})
        moveTl.add(tl, 0)
      })
    })
    return moveTl
  }

// Progression Moves ============================

  public californiaTwirlUpAndDown(startPos) {
    console.log("Hit MOVE californiaTwirl")
    console.log(startPos.h4Birds.nEBirds.length)
    console.log(startPos)
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();

    // Set up formula for determining x-value offset (depends on whether couples are out)
    let xOffsetForWestBirds, xOffsetForEastBirds
    // if there are couples out
    if ('nEBird' in startPos.outBirds) {
      xOffsetForWestBirds = 100;
      xOffsetForEastBirds = 220;
    } else {// if all couples are in
      xOffsetForWestBirds = -20;
      xOffsetForEastBirds = 100
    }

    startPos.h4Birds.nWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i+xOffsetForWestBirds + "px 140px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "+=40"})
      } else if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i+xOffsetForWestBirds + "px 140px"})
          .to(bird.nativeElement, 0.8, {y: "+=40"}, "+=0.6")
      }
      nWTl.add(tl, 0)
    })
    startPos.h4Birds.sWBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i+xOffsetForWestBirds + "px 180px"})
          .to(bird.nativeElement, 0.8, {y: "-=40"}, "+=0.6")
      } else if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i+xOffsetForWestBirds + "px 180px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "-=40"})
      }
      sWTl.add(tl, 0)
    })
    startPos.h4Birds.nEBirds.map(function(bird,i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i+xOffsetForEastBirds + "px 140px"})
          .to(bird.nativeElement, 0.8, {y: "+=40"}, "+=0.6")
      } else if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "+=90", svgOrigin: 240*i+xOffsetForEastBirds + "px 140px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "+=40"})
      }
      nETl.add(tl, 0)
    })
    startPos.h4Birds.sEBirds.map(function(bird, i) {
      let tl = new TimelineMax();
      if (bird.nativeElement.id[0] === "L") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i+xOffsetForEastBirds + "px 180px"}, "+=0.6")
          .to(bird.nativeElement, 0.8, {y: "-=40"})
      } else if (bird.nativeElement.id[0] === "R") {
        tl.to(bird.nativeElement, 0.6, {rotation: "-=90", svgOrigin: 240*i+xOffsetForEastBirds + "px 180px"})
          .to(bird.nativeElement, 0.8, {y: "-=40"}, "+=0.6")
      }
      sETl.add(tl, 0)
    })
    return [nETl, sETl, sWTl, nWTl]
  }

// Accessory Methods Regarding End Effects for Updating BirdsLocation =======================
  /// Waiting Out and Going in Perpendicular to Direction of Travel =======================

  public sendCouplesOutPerpendicular(birdsLocation) {
    console.log("Hit position update sendCouplesOutPerpendicular")
    for (let i = 0; i < 3; i++) {
      console.log(birdsLocation.h4Birds.nEBirds[i])
    }
    // TODO: Check: first time this is called in heartbeat. birdsLoc will be the result of improper(1)
    // (Is birdsLoc at the end of this method the same as at the end of improper(1))
    birdsLocation.outBirds.nEBird = birdsLocation.h4Birds.nWBirds.pop();
    birdsLocation.outBirds.sEBird = birdsLocation.h4Birds.sWBirds.pop();
    birdsLocation.outBirds.sWBird = birdsLocation.h4Birds.sEBirds.shift();
    birdsLocation.outBirds.nWBird = birdsLocation.h4Birds.nEBirds.shift();
    console.log(birdsLocation.h4Birds.nEBirds.length)
    for (let j = 0; j < 3; j++) {
      console.log(birdsLocation.h4Birds.nEBirds[j])
    }
    return birdsLocation
  }

  public crossoverPerpendicular(birdsLocation) {
    console.log("Hit position update crossoverPerpendicular")
    console.log(birdsLocation.h4Birds.nEBirds.length)
    // update out birds (cross them over) who are waiting out perpendicular to direction of travel
    let newNE = birdsLocation.outBirds.sEBird;
    let newSE = birdsLocation.outBirds.nEBird;
    let newSW = birdsLocation.outBirds.nWBird;
    let newNW = birdsLocation.outBirds.sWBird;
    birdsLocation.outBirds.nEBird = newNE;
    birdsLocation.outBirds.sEBird = newSE;
    birdsLocation.outBirds.sWBird = newSW;
    birdsLocation.outBirds.nWBird = newNW;
    return birdsLocation
  }

  public incorporateOutCouplesPerpendicular(birdsLocation) {
    console.log("Hit position update incorporateOutCouplesPerpendicular")
    console.log(birdsLocation.h4Birds.nEBirds.length)
    birdsLocation.h4Birds.nEBirds.push(birdsLocation.outBirds.nEBird)
    birdsLocation.h4Birds.sEBirds.push(birdsLocation.outBirds.sEBird)
    birdsLocation.h4Birds.sWBirds.unshift(birdsLocation.outBirds.sWBird)
    birdsLocation.h4Birds.nWBirds.unshift(birdsLocation.outBirds.nWBird)
    birdsLocation.outBirds = {} // The next time birdsLoc gets updated, does it rely on outBirds being blank?
    // TODO: When is the next time bl gets updated?
    return birdsLocation
  }

  /// Waiting Out and Going in Parallel, with a Slide Left =========

  public sendCouplesOutParallelSlideLeft(birdsLocation) {

  }

  public crossoverParallelSlideLeft(birdsLocation) {

  }

  public incorporateOutCouplesParallelSlideLeft() {

  }


// Methods for Animating End Effects =======================

  // animation for out couples who wait out in Improper or Proper Formation (perpendicular to direction of travel)
  public crossoverPerpendicularAnimation(birdsLocation) {
    console.log("Hit move crossoverPerpendicularAnimation")


    // console.log(getComputedStyle(birdsLocation.outBirds.nEBird.nativeElement))
    // console.log(birdsLocation)
    // console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].x)
    // console.log(birdsLocation.outBirds.nEBird.nativeElement.getBoundingClientRect().left) // top corner x axis value
    // console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].left)
    //
    // console.log(birdsLocation.outBirds.nEBird.nativeElement.getBoundingClientRect().y) // origin?
    // console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].y)
    // console.log(birdsLocation.outBirds.nEBird.nativeElement.getBoundingClientRect().top) // left corner y axis value
    // console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].top)
    let tl = new TimelineMax();
    tl.to(birdsLocation.outBirds.nEBird.nativeElement, 2, {rotation: "-=180", svgOrigin: "620px 160px"}, 0)
      .to(birdsLocation.outBirds.sEBird.nativeElement, 2, {rotation: "+=180", svgOrigin: "620px 160px"}, 0)
      .to(birdsLocation.outBirds.sWBird.nativeElement, 2, {rotation: "-=180", svgOrigin: "20px 160px"}, 0)
      .to(birdsLocation.outBirds.nWBird.nativeElement, 2, {rotation: "+=180", svgOrigin: "20px 160px"}, 0)
    return tl
  }

  public incorporateOutCouplesPerpendicularAnimation(birdsLocation) {
    // does this even need an animation?
  }
}


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
