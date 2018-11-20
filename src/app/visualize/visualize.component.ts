import { Component, Input, OnInit, ViewChild, ViewChildren, ElementRef, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import { TweenMax, TimelineMax } from 'gsap/TweenMax';
import { ApiService } from '../api.service';

import { Dance } from '../dance';
import { Move } from '../move';
import { Position } from '../position';
import { SnakeToCamelPipe } from '../snakeToCamel.pipe';

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss']
})

export class VisualizeComponent implements OnInit {

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

  public currentDance:Dance;
  public animationData;
  public currentChosenDanceFromChild:number;
  public currentStep;
  public steps:Array<Move|Position>;
  // public nEBirds = [];
  // public sEBirds = [];
  // public sWBirds = [];
  // public nWBirds = [];
  public birdsLocation = { nEBirds: [this.R5, this.R3, this.R1],
                           sEBirds: [this.L5, this.L3, this.L1],
                           sWBirds: [this.R6, this.R4, this.R2],
                           nWBirds: [this.L6, this.L4, this.L2] };

  constructor(private el: ElementRef,
    private renderer: Renderer2, public apiService:ApiService, private snakeToCamel:SnakeToCamelPipe) { }

  ngOnInit() {
    this.danceCurrentDance()
  }

  public danceCurrentDance() {
    this.setImproper()
    // this.setUpDance()
    // this.setImproper()
    this.petronella();
    this.steps.forEach(function(step) {
      console.log(step)
      if (step instanceof Position) {
        let snakeString = step.description
        console.log(snakeString)
        let camelString = this.snakeToCamel.transform(snakeString)
        console.log("abc" , camelString)
      }
    })
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(changes)
  //   for (const propName of Object.keys(changes)) {
  //     const change = changes[propName]
  //     console.log(change);
  //     const from = JSON.stringify(change.previousValue);
  //     const to = JSON.stringify(change.currentValue);
  //     console.log('From: ' + from + ' to ' + to)
  //   }
  // }

  public getMovesAndPositions() {
    let danceId:number = this.currentDance.id
    this.apiService.getSteps('dance-composition', danceId).subscribe((stepsData) => {
      stepsData.forEach(function(step, i) {
        if (step.hasOwnProperty('description')) {
          let position = new Position(step.id, false, step['description'])
          if (i === 0) {
            position.isFormation = true
          }
          this.steps.push(position)
        }
        else if (step.hasOwnProperty('name')) {
          this.steps.push(new Move(step.id, step['name']))
        }
      }, this)
    })
  }

  public handleChosenDance(eventData:number) {
    this.currentChosenDanceFromChild = eventData;
    this.apiService.getAnimationInfo('info-for-animation', eventData).subscribe((animationData) => {
      this.animationData = animationData
    })
  }

  public eventFromSteps(passed) {
    console.log(passed)
    this.currentStep = passed;
    console.log(this.snakeToCamel.transform(this.currentStep.description))
  }

  // Set Positions

  public setImproper() {
    let dottedLarks = [this.L5, this.L3, this.L1] // needs to eventually not be hard coded in each position ???
    let solidLarks = [this.L6, this.L4, this.L2]
    let dottedRavens = [this.R5, this.R3, this.R1]
    let solidRavens = [this.R6, this.R4, this.R2]

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

    this.birdsLocation.nEBirds = [R5, R3, R1];
    this.birdsLocation.sEBirds = [L5, L3, L1];
    this.birdsLocation.sWBirds = [R6, R4, R2];
    this.birdsLocation.nWBirds = [L6, L4, L2];
    return this;
  }

  public setImproperProgressed() {
    let dottedLarks = [this.L5, this.L3, this.L1]
    let solidLarks = [this.L6, this.L4, this.L2]
    let dottedRavens = [this.R5, this.R3, this.R1]
    let solidRavens = [this.R6, this.R4, this.R2]

    dottedLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
       bird.nativeElement.style.cy = '220px';
    })
    solidLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
       bird.nativeElement.style.cy = '100px';
    })
    dottedRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
       bird.nativeElement.style.cy = '100px';
    })
    solidRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
       bird.nativeElement.style.cy = '220px';
    })
    this.birdsLocation.nEBirds = [L6, L4, L2];
    this.birdsLocation.sEBirds = [R6, R4, R2];
    this.birdsLocation.sWBirds = [R5, R3, R1];
    this.birdsLocation.nWBirds = [L5, L3, L1];

    return this;
  }

  public setOppositeBecket() {
    let dottedLarks = [this.L5, this.L3, this.L1]
    let solidLarks = [this.L6, this.L4, this.L2]
    let dottedRavens = [this.R5, this.R3, this.R1]
    let solidRavens = [this.R6, this.R4, this.R2]

    dottedLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
       bird.nativeElement.style.cy = '100px';
    })
    solidLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
       bird.nativeElement.style.cy = '220px';
    })
    dottedRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
       bird.nativeElement.style.cy = '100px';
    })
    solidRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
       bird.nativeElement.style.cy = '220px';
    })
  }

// Define Moves
/// Moves need to know:
// - ending_pos,
// - how many complete h4's there are (3 or 2)
// - is the move a progression?
/// The animation will update the nE, sE, sW, nW variables, which will be set like this.NE = [this.R1, this.R3, this.R5]

  public petronella() {
    this.birdsLocation.nEBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:-40, y:40})
        .to(bird, 1, {x:-120, y:0})
    })
    this.birdsLocation.sEBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:-40, y:-40})
        .to(bird, 1, {x:0, y:-120})
    })
    this.birdsLocation.sWBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:40, y:-40})
        .to(bird, 1, {x:120, y:0})
    })
    this.birdsLocation.nWBirds.map(function(bird) {
      var tl = new TimelineMax();
      tl.to(bird, 1, {x:40, y:40})
        .to(bird, 1, {x:0, y:120})
    })
    // petronella needs to update this.birdsLocation, but in the relative sense - relative to where birds were before
    let currentNWBirds = this.birdsLocation.nWBirds
    this.birdsLocation.nWBirds = this.birdsLocation.nEBirds
    this.birdsLocation.nEBirds = this.birdsLocation.sEBirds
    this.birdsLocation.sEBirds = this.birdsLocation.sWBirds
    this.birdsLocation.sWBirds = currentNWBirds
    return this // ?? should this be here?
  }


//   public doStuff() {
//     // doStuff for Heartbeat Contra
//     // select improper position
//     /// hide all except four in mainh4 corners
//     /// display 6D as is, (don't forget to select all 6D's)
//     /// display others as appropriate
//     //// raven-one in D3
//
// /// give up on host, dynamically set which circle should be raven by passing a variable into the css
//   }

  // public setStyles() {
  //   let styles
  //
  //   if ($('div').hasClass("B2")) {
  //     styles = {
  //       'fill':'black'
  //     };
  //   }
  //
  //   return styles
  // }

}

// first, hide all circles
// then, display the 4
//

// move, display position with svg positions
// create one dark brown circle with [ngStyle]="lark-one-var"
// method setImproper() will give that lark the appropriate x, y values

// with grid systems, A1, ... D9
// give each one [ngStyle]='A1', etc
// if we want B2 to display as lark one, set variable B2 = { style object }
// how to select the rest to hide?
// give [ngClass]=tohide variable to each circle,



// this.larkOnePosition = {'left':this.squarePosition3, 'top':this.squarePosition4}
// // this.larkOne = "h4C"
//
// this.ravenOnePosition = {'left':this.squarePosition3, 'top':this.squarePosition2}
//
// this.larkTwoPosition = {'left':this.squarePosition1, 'top':this.squarePosition2}
// // this.larkTwo = "h4A"
//
// this.ravenTwoPosition = {'left':this.squarePosition1, 'top':this.squarePosition4}
// // this.ravenTwo = "h4D"



// animate whatever is in place h4B to innerB
/// select element in with class h4B
//ignor ngClass, and give .raven-one a class of h4B or #h4B
// console.log(this.ravenOne)
// take the object with h4B and animate it
/// start with animating in css file selecting with class=raven-one, then animate from here and with class h4B


// this.renderer.setStyle(this.ravenOne.nativeElement, 'animation-name', 'petronellaRavenOne')
// this.renderer.setStyle(this.ravenOne.nativeElement, 'animation-duration', '1000ms')
// this.renderer.setStyle(this.ravenOne.nativeElement, 'animation-timing-function', 'ease-in-out')
// this.renderer.setStyle(this.ravenOne.nativeElement, 'animation-fill-mode', 'forwards')
// this.renderer.setStyle(this.ravenOne.nativeElement, 'animation-delay', '1.5s')
//
// this.renderer.setStyle(this.larkOne.nativeElement, 'animation-name', 'petronellaLarkOne')
// this.renderer.setStyle(this.larkOne.nativeElement, 'animation-duration', '1000ms')
// this.renderer.setStyle(this.larkOne.nativeElement, 'animation-timing-function', 'ease-in-out')
// this.renderer.setStyle(this.larkOne.nativeElement, 'animation-fill-mode', 'forwards')
// this.renderer.setStyle(this.larkOne.nativeElement, 'animation-delay', '1.5s')
//
// this.renderer.setStyle(this.larkTwo.nativeElement, 'animation-name', 'petronellaLarkTwo')
// this.renderer.setStyle(this.larkTwo.nativeElement, 'animation-duration', '1000ms')
// this.renderer.setStyle(this.larkTwo.nativeElement, 'animation-timing-function', 'ease-in-out')
// this.renderer.setStyle(this.larkTwo.nativeElement, 'animation-fill-mode', 'forwards')
// this.renderer.setStyle(this.larkTwo.nativeElement, 'animation-delay', '1.5s')
//
// this.renderer.setStyle(this.ravenTwo.nativeElement, 'animation-name', 'petronellaRavenTwo')
// this.renderer.setStyle(this.ravenTwo.nativeElement, 'animation-duration', '1000ms')
// this.renderer.setStyle(this.ravenTwo.nativeElement, 'animation-timing-function', 'ease-in-out')
// this.renderer.setStyle(this.ravenTwo.nativeElement, 'animation-fill-mode', 'forwards')
// this.renderer.setStyle(this.ravenTwo.nativeElement, 'animation-delay', '1.5s')

// public danceSetState;
// public dancerState;

// darkLarks = [this.L1, this.L3, this.L5]
//
// @ViewChild('h4B') private h4B: ElementRef

// @ViewChildren('raven1','h4B') myArrayRef

// squarePosition1 = '0px';
// squarePosition2 = '80px';
// squarePosition3 = '120px';
// squarePosition4 = '200px';

// L1Style
// L2Style
// L3Style
// L4Style
// L5Style
// L6Style
// R1Style
// R2Style
// R3Style
// R4Style
// R5Style
// R6Style

// private get R1() {
//   return this.r1;
// }
// private get L1() {
//   return this.r1.nativeElement;
// }
// private get R2() {
//   return this.r1.nativeElement;
// }
// private get L2() {
//   return this.r1.nativeElement;
// }
// private get R3() {
//   return this.r1.nativeElement;
// }
// private get L3() {
//   return this.r1.nativeElement;
// }
// private get R4() {
//   return this.r1.nativeElement;
// }
// private get L4() {
//   return this.r1.nativeElement;
// }
// private get R5() {
//   return this.r1.nativeElement;
// }
// private get L5() {
//   return this.r1.nativeElement;
// }
// private get R6() {
//   return this.r1.nativeElement;
// }
// private get L6() {
//   return this.r1.nativeElement;
// }

// animations: [
//   trigger('goAnimate', [
//     state('priorToAnimation', style({
//       opacity: 1
//     })),
//     state('postAnimation', style({
//       opacity: 0
//     })),
//     transition('priorToAnimation => postAnimation', animate('600ms ease-out'))
//   ])
// ]
// animations: [
//   trigger('danceSetAnimate', [
//     // bring all 4 dancers into middle of h4
//     state('improper', style({
//     // states are equivalent to positions, transitions are equivalent to moves
//   })),
//     transition('* => improper', [
//       query('#L6', animate(1000, style({opacity:0}))),
//     ])
//   ]),
//   trigger('dancerAnimate', [
//
//   ])
// ]
