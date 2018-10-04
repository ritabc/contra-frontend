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
  }

  public doStuff() {
    // doStuff for Heartbeat Contra
    // select improper position
    /// hide all except four in mainh4 corners
    /// display 6D as is, (don't forget to select all 6D's)
    /// display others as appropriate
    //// raven-one in D3
    this.setImproper()


/// give up on host, dynamically set which circle should be raven by passing a variable into the css
  }

  public setClasses() {
    let styles = {}

    if ($('div').hasClass("B2")) {
      styles = {
        'fill':'black'
      };
    }
    return styles
  }

}
