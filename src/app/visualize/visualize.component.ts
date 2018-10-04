import { Component, OnInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-visualize',
  templateUrl: './visualize.component.html',
  styleUrls: ['./visualize.component.scss']
})
export class VisualizeComponent implements OnInit {

  dancerColors: {
    '--larkOneColor': '#583820',
    '--larkTwoColor': '#d1864c',
    '--ravenOneColor': '#1f1f1f',
    '--ravenTwoColor': '#9f9f9f',
  }

  constructor() { }

  ngOnInit() {
    // document.querySelector(".B2")[0].style.display = 'none';

  }

  public doStuff() {
    // doStuff for Heartbeat Contra
    // select improper position
    /// hide all except four in mainh4 corners
    /// display 6D as is, (don't forget to select all 6D's)
    /// display others as appropriate
    //// raven-one in D3

/// give up on host, dynamically set which circle should be raven by passing a variable into the css
  }

  public setStyles() {
    let styles

    if ($('div').hasClass("B2")) {
      styles = {
        'fill':'black'
      };
    }

    return styles
  }

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
