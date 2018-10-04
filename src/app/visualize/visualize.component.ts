import { Component, Directive, OnInit, AfterViewInit, ViewChild, ViewChildren, ElementRef, Renderer2 } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss']
})

// @Directive({
//   selector: '[h4B]'
// })

export class VisualizeComponent implements OnInit, AfterViewInit {

  @ViewChild('raven1') private ravenOne:ElementRef;
  //
  // @ViewChild('h4B') private h4B: ElementRef

  // @ViewChildren('raven1','h4B') myArrayRef

  dancerColors: {
    '--larkOneColor': '#583820',
    '--larkTwoColor': '#d1864c',
    '--ravenOneColor': '#1f1f1f',
    '--ravenTwoColor': '#9f9f9f',
  }

  squarePosition1 = '0px';
  squarePosition2 = '80px';
  squarePosition3 = '120px';
  squarePosition4 = '200px';

  larkOnePosition
  ravenOnePosition
  larkTwoPosition
  ravenTwoPosition

  // larkOneClass
  // larkTwoClass
  // ravenOneClass
  // ravenTwoClass

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.setImproper()
  }

  ngAfterViewInit() {
    this.renderer.addClass(this.ravenOne.nativeElement, 'h4B')
    this.petronella()

  }

  public setImproper() {
    this.larkOnePosition = {'left':this.squarePosition3, 'top':this.squarePosition4}
    // this.larkOne = "h4C"

    this.ravenOnePosition = {'left':this.squarePosition3, 'top':this.squarePosition2}

    this.larkTwoPosition = {'left':this.squarePosition1, 'top':this.squarePosition2}
    // this.larkTwo = "h4A"

    this.ravenTwoPosition = {'left':this.squarePosition1, 'top':this.squarePosition4}
    // this.ravenTwo = "h4D"
  }

  public petronella() {
    // animate whatever is in place h4B to innerB
    /// select element in with class h4B
    //ignor ngClass, and give .raven-one a class of h4B or #h4B
    // console.log(this.ravenOne)
    // take the object with h4B and animate it
    /// start with animating in css file selecting with class=raven-one, then animate from here and with class h4B
    // debugger
    this.renderer.setStyle(this.ravenOne.nativeElement, 'transition-property', 'transform')
    this.renderer.setStyle(this.ravenOne.nativeElement, 'transition-duration', '1000ms')
    this.renderer.setStyle(this.ravenOne.nativeElement, 'transition-timing-function', 'ease-in-out')
    // this.ravenOnePosition = {'transition-property':'transform', 'transition-duration':'300ms', 'transition-timing-function':'ease-in-out'};
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
