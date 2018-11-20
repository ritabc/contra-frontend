import { Component, Input, OnInit } from '@angular/core';
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
  public currentDance:Number;
  public animationData;
  public currentStep;
  public steps:Array<Move|Position>;
  // public nEBirds = [];
  // public sEBirds = [];
  // public sWBirds = [];
  // public nWBirds = [];

  constructor(public apiService:ApiService, private snakeToCamel:SnakeToCamelPipe) { }

  ngOnInit() {
    // this.getMovesAndPositions()
  }

  public getMovesAndPositions() {
    let danceId:Number = this.currentDance
    console.log(danceId)
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

  public handleChosenDance(danceFromChoice) {
    this.currentDance = danceFromChoice
    // this.apiService.getAnimationInfo('info-for-animation', eventData).subscribe((animationData) => {
    //   this.animationData = animationData
    // })
  }

  public eventFromSteps(passed) {
    this.currentStep = passed;
    console.log(this.snakeToCamel.transform(this.currentStep.description))
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
