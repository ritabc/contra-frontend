import { Component, Directive, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss']
})

// @Directive({
//   selector: '[raven1]'
// })

export class VisualizeComponent implements AfterViewInit {

  @ViewChild('raven1') private ravenOne: ElementRef;

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

    this.petronella()

  }

  public setImproper() {
    this.larkOnePosition = {'left':this.squarePosition3, 'top':this.squarePosition4}
    // this.larkOne = "h4C"

    this.ravenOnePosition = {'left':this.squarePosition3, 'top':this.squarePosition2}
    this.renderer.addClass(this.ravenOne.nativeElement, 'h4B')

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
