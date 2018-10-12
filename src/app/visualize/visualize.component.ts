import { Component, Directive, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, Renderer2 } from '@angular/core';

// Need to find way to select with h4 Position variable. I assign it as h4B, but can't select by it

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss']
})

// @Directive({
//   selector: '[h4B]'
// })

export class VisualizeComponent implements OnInit, AfterViewInit {

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

  public currentDance
  currentDanceFromChild:number

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


  constructor(private el: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit() {
    // console.log(this.L1.nativeElement)
    this.setImproper()

  }

  ngAfterViewInit() {

    // this.renderer.addClass(this.ravenOne.nativeElement, 'h4B')
    // this.petronella()

  }

  public handleChosenDance(eventData:number) {
    this.currentDanceFromChild = eventData;
  }

  public setImproper() {
    let darkLarks = [this.L1, this.L3, this.L5] // needs to eventually not be hard coded in each position
    darkLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
       bird.nativeElement.style.cy = '220px';
    })

    let lightLarks = [this.L2, this.L4, this.L6]
    lightLarks.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
       bird.nativeElement.style.cy = '100px';
    })

    let darkRavens = [this.R1, this.R3, this.R5]
    darkRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-100).toString() + 'px';
       bird.nativeElement.style.cy = '100px';
    })

    let lightRavens = [this.R2, this.R4, this.R6]
    lightRavens.forEach(function(bird, index) {
      bird.nativeElement.style.cx = (240*(index+1)-220).toString() + 'px';
       bird.nativeElement.style.cy = '220px';
    })



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
  }

  public petronella() {
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
