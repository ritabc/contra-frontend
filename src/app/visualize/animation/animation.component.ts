import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { TweenLite, TweenMax, TimelineMax, CSSPlugin } from 'gsap/TweenMax';

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
    // this.becketFormation();
    // let startPos = this.becket(0);
    // this.californiaTwirlUpAndDown(startPos)
    // let nextPos = this.improperProgressed(0);
    // this.swingOnSidesOfSet(nextPos)
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

        // run the formation method to set up dancers at start of dance
        this[this.nameConverter.transform(positions[0].description) + "Formation"]()

        let danceTimeline = new TimelineMax({})
        // for (let progIndex = 0; progIndex < 5; progIndex++) {
        //
        // }
        moves.forEach(function(move, index) {
          console.log("beginning of loop, index is: ", index)
          let moveMethod = this[this.nameConverter.transform(move.name)]
          let rubyPositionName = positions[index].description.toString()
          let positionName = this.nameConverter.transform(rubyPositionName);
          if (typeof moveMethod === 'function' && typeof this[positionName] === 'function' ) {
            let moveStartPositionGenerator = this[positionName](0); // 0 needs updating later based on which play through the user is on (aka how far red has gotten)
            danceTimeline.add(moveMethod(moveStartPositionGenerator, false))
          } else {
            danceTimeline.killAll(false, true, false, true) // complete the killed things? kill tweens?  kill delayedCalls? kill timelines?
            console.log("reached")
            return null
          }
          console.log("end of loop, index is: ", index)
        }, this)
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
      }
    }
    return birdsLocation
  }

  public becket(progressionNumber:number) {
    console.log("hit POSITION becket")
    let couplesOut:boolean;
    let birdsLocation:any = { nEBirds: [this.L6, this.L4, this.L2],
                              sEBirds: [this.R5, this.R3, this.R1],
                              sWBirds: [this.L5, this.L3, this.L1],
                              nWBirds: [this.R6, this.R4, this.R2] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
        couplesOut = false
      } else if (prog % 2 === 1) {
        couplesOut = true
        let newNE = birdsLocation.sWBirds.shift();
        let newSE = birdsLocation.nWBirds.pop();
        let newSW = birdsLocation.nEBirds.pop();
        let newNW = birdsLocation.sEBirds.shift();
        birdsLocation.nEBirds.unshift(newNE)
        birdsLocation.sEBirds.push(newSE)
        birdsLocation.sWBirds.push(newSW)
        birdsLocation.nWBirds.unshift(newNW)
      } else if (prog % 2 === 0) {
        couplesOut = false
      } else { return null }
    }
    return birdsLocation
  }

  public sideOfSetWithNeighborOnesFacingDown(progressionNumber: number) {
    // note that if and when out couples exist, they must wait proper
    console.log("hit POSITION sideOfSetWithNeighborOnesFacingDown")
    let couplesOut:boolean;
    let birdsLocation:any = { nEBirds: [this.L5, this.L3, this.L1],
                              sEBirds: [this.R5, this.R3, this.R1],
                              sWBirds: [this.L6, this.L4, this.L2],
                              nWBirds: [this.R6, this.R4, this.R2] }
    for (let prog = 0; prog <= progressionNumber; prog++) {
      if (prog > 12) {
        return null
      }
      else if (prog === 0) {
        couplesOut = false;
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

// MOVES =================================================
// Define Moves
/// Moves need to know:
// - whether couples are out?
// - is the move a progression?
// Instead of the animating move updating the birdsLocation varible, it will just animate
// Note on animations: Remember that x and y changes in a .to addition to a timeline change the x and y relative to where they were before. Instead, use the absolute (where origin is 0,0) cx and cy positioning?

  public balanceTheRing(startPos, couplesOut:boolean = false) {
    console.log("hit MOVE balanceTheRing")
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();

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
    return [nETl, sETl, sWTl, nWTl]
  }

  public petronella(startPos, couplesOut:boolean = false) {
    console.log("hit MOVE petronella")
    let nETl = new TimelineMax();
    let sETl = new TimelineMax();
    let sWTl = new TimelineMax();
    let nWTl = new TimelineMax();

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
    return [nETl, sETl, sWTl, nWTl]
  }

  public swingOnSidesOfSet(startPos, couplesOut:boolean = false) {
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

  public dancersOnRightRightShoulderRoundOnceAndAHalf(startPos, couplesOut:boolean = false) {
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

  public dancersOnLeftRightShoulderRoundOnceAndAHalf(startPos, couplesOut:boolean = false) {
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

  public circleLeftThreeQuarters(startPos, couplesOut:boolean = false) {
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

  public californiaTwirlUpAndDown(startPos, couplesOut:boolean = false) {
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
