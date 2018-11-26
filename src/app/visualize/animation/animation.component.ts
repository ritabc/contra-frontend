import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { TweenMax, TimelineMax } from 'gsap/TweenMax';

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

  public birdsLocation = { nEBirds: [this.R5, this.R3, this.R1],
                           sEBirds: [this.L5, this.L3, this.L1],
                           sWBirds: [this.R6, this.R4, this.R2],
                           nWBirds: [this.L6, this.L4, this.L2] };

  constructor(private el: ElementRef, private snakeToCamel:SnakeToCamelPipe) { }

  ngOnInit() {
    this.improper()
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];
      if (!change.firstChange) {
        change.currentValue.forEach(function(step) {
          if (step instanceof Position) {
            if (step.isFormation) {
              this[this.snakeToCamel.transform(step.description)]();
            }
          }
          else if (step instanceof Move) {
            this[this.snakeToCamel.transform(step.name)]();
          }
        }, this)
      }
    }
  }

  // public danceCurrentDance() {
  //   this.improper()
    // this.setUpDance()
    // this.setImproper()
    // this.petronella();
    // console.log(this.steps);
    // this.steps.forEach(function(step) {
    //   console.log(step);
    //   if (step instanceof Position) {
    //     let snakeString = step.description;
    //     console.log(snakeString);
    //     let camelString = this.snakeToCamel.transform(snakeString);
    //     console.log("abc" , camelString);
    //   }
    // }
  // }

  // Set Positions
  public improper() {
    let dottedLarks = [this.L5, this.L3, this.L1] // needs to eventually not be hard coded in each position ???
    let solidLarks = [this.L6, this.L4, this.L2]
    let dottedRavens = [this.R5, this.R3, this.R1]
    let solidRavens = [this.R6, this.R4, this.R2]

    dottedLarks.forEach(function(bird, index) {
      console.log(dottedLarks)
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
    // return this;
  }


  public improperProgressed() {
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

    // return this;
  }

  public oppositeBecket() {
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
    // return this // ?? should this be here?
  }

}
