import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { TweenLite, TweenMax, TimelineMax, CSSPlugin } from 'gsap/TweenMax';

import { Move } from '../../move';
import { Position } from '../../position';
import { Dance } from '../../dance';
import { SnakeToCamelPipe } from '../../snakeToCamel.pipe';
import { ApiService } from '../../api.service';

@Component({
    selector: 'app-animation',
    templateUrl: './animation.component.html',
    styleUrls: ['./animation.component.scss']
})

export class AnimationComponent implements OnInit, OnChanges {
    @Input() steps: Array<Move | Position>;

    @ViewChild('R1') private R1: ElementRef;
    @ViewChild('L1') private L1: ElementRef;
    @ViewChild('R2') private R2: ElementRef;
    @ViewChild('L2') private L2: ElementRef;
    @ViewChild('R3') private R3: ElementRef;
    @ViewChild('L3') private L3: ElementRef;
    @ViewChild('R4') private R4: ElementRef;
    @ViewChild('L4') private L4: ElementRef;
    @ViewChild('R5') private R5: ElementRef;
    @ViewChild('L5') private L5: ElementRef;
    @ViewChild('R6') private R6: ElementRef;
    @ViewChild('L6') private L6: ElementRef;
    // couplesOut:boolean = true // calculate this instead in ngOnChanges by even or oddness of progNumber
    // @Input() danceId:number;
    @Input() currentDance: Dance

    constructor(private nameConverter: SnakeToCamelPipe, private apiService: ApiService) { }

    ngOnInit() {
        setTimeout(() => {

            let birdsLoc = this.improperFormation()
            this.swingOnSidesOfSet(birdsLoc)
            // let tl = new TimelineMax;
        }, 1000);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName of Object.keys(changes)) { // change to for the changes.steps
            const change = changes[propName];
            if (propName === "steps" && !change.firstChange) { // if steps have changed and its not the initial page load
                console.log(change.currentValue) // Is array of steps like: [formationPos, move1, endingPos1, move2, endingPos2,...moveN, endingPosN]

                // Take steps (dance_moves) for dance, convert into positions and moves
                let positions: Array<Position> = [];
                let moves: Array<Move> = [];
                change.currentValue.forEach(function (step, i) {
                    if (i === 0) {
                        positions.push(step)
                    } else if (i % 2 === 1) {
                        moves.push(step)
                    } else if (i % 2 === 0) {
                        positions.push(step)
                    }
                })
                console.log(positions, moves)

                // run the formation method to set up dancers at start of dance, get birdsLoc for the first time

                let danceTimeline = new TimelineMax({})
                var birdsLoc

                for (let progIndex = 0; progIndex < 12; ++progIndex) {
                    moves.forEach(function (move, moveIndex) {

                        // obtain moveMethod name and position Method name, check whether they both exist as functions
                        let moveMethod = this[this.nameConverter.transform(move.name)]
                        let rubyPositionName = positions[moveIndex].description.toString()
                        let positionName = this.nameConverter.transform(rubyPositionName);
                        if (typeof moveMethod === 'function' && typeof this[positionName] === 'function') {

                            // if this is the very first move, set up the formation
                            if (progIndex === 0 && moveIndex === 0) {
                                birdsLoc = this[this.nameConverter.transform(positions[0].description) + "Formation"]();
                                danceTimeline.add(moveMethod(birdsLoc));

                                // if the move is a progression
                            } else if (moveIndex === moves.length - 1) {

                                // For every progression: animate the progression move, and get the final (or first) position
                                danceTimeline.add(moveMethod(birdsLoc), "Progression" + progIndex.toString());
                                birdsLoc = this[this.nameConverter.transform(positions[moveIndex + 1].description)](progIndex);

                                // If statement based on whether birds are out
                                /// if NO couples are out, couples need to be sent out
                                if (progIndex % 2 === 0) {
                                    // update birdsLoc
                                    birdsLoc = this.sendCouplesOutPerpendicular(birdsLoc) // will need to later be dynamic depending on how couples wait out
                                    birdsLoc = this.crossoverPerpendicular(birdsLoc)
                                    // add end effects animation to timeline after the Progression Happens
                                    danceTimeline.add(this.crossoverPerpendicularAnimation(birdsLoc), "Progression" + progIndex.toString() + "+=2")

                                    /// if couples ARE out, they need to come back in
                                } else if (progIndex % 2 === 1) {
                                    birdsLoc = this.incorporateOutCouplesPerpendicular(birdsLoc)
                                }

                                // if the move is NOT a progression, NOT the formation
                            } else {
                                birdsLoc = this[positionName](progIndex);
                                danceTimeline.add(moveMethod(birdsLoc));
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

    public improperFormation() {
        console.log("hit formation setup");
        let birdsLocation: any = {
            h4Birds: {
                nEBirds: [this.R5, this.R3, this.R1],
                sEBirds: [this.L5, this.L3, this.L1],
                sWBirds: [this.R6, this.R4, this.R2],
                nWBirds: [this.L6, this.L4, this.L2]
            },
            outBirds: {}
        }

        // UPDATED from bird.nativeElement.style.cx = dx
        birdsLocation.h4Birds.sEBirds.forEach(function (bird, index) {
            let dx = (240 * index + 140).toString() + 'px';
            bird.nativeElement.setAttribute('x', dx);
            bird.nativeElement.setAttribute('y', '220px');
        })
        birdsLocation.h4Birds.nWBirds.forEach(function (bird, index) {
            let dx = (240 * index + 20).toString() + 'px'
            bird.nativeElement.setAttribute('x', dx);

            bird.nativeElement.setAttribute('y', '100px');
        })
        birdsLocation.h4Birds.nEBirds.forEach(function (bird, index) {
            let dx = (240 * index + 140).toString() + 'px'
            bird.nativeElement.setAttribute('x', dx);
            bird.nativeElement.setAttribute('y', '100px');
        })
        birdsLocation.h4Birds.sWBirds.forEach(function (bird, index) {
            let dx = (240 * index + 20).toString() + 'px'
            bird.nativeElement.setAttribute('x', dx);
            bird.nativeElement.setAttribute('y', '220px');
        })
        return birdsLocation
    }

    public becketFormation() {
        console.log("hit becket setup");
        let birdsLocation: any = {
            h4Birds: {
                nEBirds: [this.L6, this.L4, this.L2],
                sEBirds: [this.R5, this.R3, this.R1],
                sWBirds: [this.L5, this.L3, this.L1],
                nWBirds: [this.R6, this.R4, this.R2]
            },
            outBirds: {}
        }
        // The following needs refactoring to use birdsLocation instead

        let dottedLarks = [this.L5, this.L3, this.L1];
        let solidLarks = [this.L6, this.L4, this.L2];
        let dottedRavens = [this.R5, this.R3, this.R1];
        let solidRavens = [this.R6, this.R4, this.R2];

        dottedLarks.forEach(function (bird, index) {
            let dx = (240 * index + 20);
            bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 220)");
        });
        solidLarks.forEach(function (bird, index) {
            let dx = (240 * index + 140);
            bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 100)");
        });
        dottedRavens.forEach(function (bird, index) {
            let dx = (240 * index + 140);
            bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 220)");
        });
        solidRavens.forEach(function (bird, index) {
            let dx = (240 * index + 20);
            bird.nativeElement.setAttribute("transform", "translate(" + dx.toString() + " 100)");
        })
        return birdsLocation
    }

    // POSITIONS =================================================
    // Takes the progression number (aka where red is: 0 means start of dance, 12 is upper limit where everyone's back where they started), returns where each bird is in order (at prog # = 0, purple birds first, red birds last).
    // Also returns the value of outCouplesWaitingPosition, which has different values: improper, proper, becket, oppositeBecket, or none (for no couples out)
    // Down the line, if there are more than one positions out couples should be in (at first they should be proper for a move with a shadow, then wait improper to go back in), add outCouplesWaitingPosition2 variable

    public improper(progressionNumber: number) {
        console.log("hit POSITION improper")
        let birdsLocation: any = {
            h4Birds: {
                nEBirds: [this.R5, this.R3, this.R1],
                sEBirds: [this.L5, this.L3, this.L1],
                sWBirds: [this.R6, this.R4, this.R2],
                nWBirds: [this.L6, this.L4, this.L2]
            },
            outBirds: {}
        }
        for (let prog = 0; prog <= progressionNumber; ++prog) {
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

    public becket(progressionNumber: number) {
        console.log("hit POSITION becket");
        let birdsLocation: any = {
            h4Birds: {
                nEBirds: [this.L6, this.L4, this.L2],
                sEBirds: [this.R5, this.R3, this.R1],
                sWBirds: [this.L5, this.L3, this.L1],
                nWBirds: [this.R6, this.R4, this.R2]
            },
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

    public oppositeBecket(progressionNumber: number) {
        console.log("hit POSITION oppositeBecket");
        let birdsLocation: any = {
            h4Birds: {
                nEBirds: [this.L5, this.L3, this.L1],
                sEBirds: [this.R6, this.R4, this.R2],
                sWBirds: [this.L6, this.L4, this.L2],
                nWBirds: [this.R5, this.R3, this.R1]
            },
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

    public improperProgressed(progressionNumber: number) {
        console.log("hit POSITION improperProgressed");
        let birdsLocation: any = {
            h4Birds: {
                nEBirds: [this.R6, this.R4, this.R2],
                sEBirds: [this.L6, this.L4, this.L2],
                sWBirds: [this.R5, this.R3, this.R1],
                nWBirds: [this.L5, this.L3, this.L1]
            },
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
        let birdsLocation: any = {
            h4Birds: {
                nEBirds: [this.L5, this.L3, this.L1],
                sEBirds: [this.R5, this.R3, this.R1],
                sWBirds: [this.L6, this.L4, this.L2],
                nWBirds: [this.R6, this.R4, this.R2]
            },
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
    // - shouldOutCouplesAnimate (true iff moveIndex = 1)
    // - whether couples are out, and if so, what position they should wait in?
    // - is the move a progression?
    // New: just startPos and couplesOut:boolean
    // Instead of the animating move updating the birdsLocation varible, it will just animate

    // Regular Moves ==========

    public balanceTheRing = (startPos) => {
        console.log("hit MOVE balanceTheRing")

        let nETl = new TimelineMax();
        let sETl = new TimelineMax();
        let sWTl = new TimelineMax();
        let nWTl = new TimelineMax();
        // // out couples need animating too!
        // let eeTl = new TimelineMax();

        // UPDATED: added 'attr:'
        startPos.h4Birds.nEBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 1, { attr: { x: "-=40", y: "+=40" } })
                .to(bird.nativeElement, 1, { attr: { x: "+=40", y: "-=40" } })
            nETl.add(tl, 0)
        })
        startPos.h4Birds.sEBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 1, { attr: { x: "-=40", y: "-=40" } })
                .to(bird.nativeElement, 1, { attr: { x: "+=40", y: "+=40" } })
            sETl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 1, { attr: { x: "+=40", y: "-=40" } })
                .to(bird.nativeElement, 1, { attr: { x: "-=40", y: "+=40" } })
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 1, { attr: { x: "+=40", y: "+=40" } })
                .to(bird.nativeElement, 1, { attr: { x: "-=40", y: "-=40" } })
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

        // UPDATED: added 'attr:'
        startPos.h4Birds.nEBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 2, { attr: { x: "-=120" } })
            nETl.add(tl, 0)
        })
        startPos.h4Birds.sEBirds.map(function (bird) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 2, { attr: { y: "-=120" } })
            sETl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 2, { attr: { x: "+=120" } })
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (bird) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 2, { attr: { y: "+=120" } })
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

        startPos.h4Birds.sEBirds.map(function (sEBird, i) {
            let tl = new TimelineMax();
            tl.to(sEBird.nativeElement, 1.4, { attr: { x: "-=40", y: "+=20" } })
            if (sEBird.nativeElement.id[0] === 'L') {
                console.log(sEBird.nativeElement)
                tl.to(sEBird.nativeElement, 2.2, { rotation: "+=360", svgOrigin: (240 * i + xOffset).toString() + "px 220px" })
                    .to(sEBird.nativeElement, 1.4, { attr: { x: "-=40", y: "-=20" } })
            } //else if (sEBird.nativeElement.id[0] === 'R') {
            //     tl.to(sEBird.nativeElement, 1.2, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 220px" })
            //         .to(sEBird.nativeElement, 0.4, { attr: { x: "+=40", y: "+=20" } })
            // }
            sETl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (sWBird, i) {
            let tl = new TimelineMax();
            tl.to(sWBird.nativeElement, 1.4, { attr: { x: "+=40", y: "-=20" } })
            if (sWBird.nativeElement.id[0] === 'R') {
                tl.to(sWBird.nativeElement, 2.2, { rotation: "+=360", svgOrigin: 240 * i + xOffset + "px 220px" })
                    .to(sWBird.nativeElement, 1.4, { attr: { x: "+=40", y: "+=20" } })
            } // else if (sWBird.nativeElement.id[0] === 'L') {
            //     tl.to(sWBird.nativeElement, 1.2, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 220px" })
            //         .to(sWBird.nativeElement, 0.4, { attr: { x: "-=40", y: "-=20" } })
            // }
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (nWBird, i) {
            let tl = new TimelineMax();
            tl.to(nWBird.nativeElement, 0.4, { attr: { x: "+=40", y: "-=20" } })
            if (nWBird.nativeElement.id[0] === 'L') {
                tl.to(nWBird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 100px" })
                    .to(nWBird.nativeElement, 0.4, { attr: { x: "+=40", y: "+=20" } })
            } // else if (nWBird.nativeElement.id[0] === 'R') {
            //     tl.to(nWBird.nativeElement, 1.2, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 100px" })
            //         .to(nWBird.nativeElement, 0.4, { attr: { x: "-=40", y: "-=20" } })
            // }
            nWTl.add(tl, 0)
        })
        startPos.h4Birds.nEBirds.map(function (nEBird, i) {
            let tl = new TimelineMax();
            tl.to(nEBird.nativeElement, 0.4, { attr: { x: "-=40", y: "+=20" } })
            if (nEBird.nativeElement.id[0] === 'R') {
                tl.to(nEBird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 100" })
                    .to(nEBird.nativeElement, 0.4, { attr: { x: "-=40", y: "-=20" } })
            } // else if (nEBird.nativeElement.id[0] === 'L') {
            //     tl.to(nEBird.nativeElement, 1.2, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 100" })
            //         .to(nEBird.nativeElement, 0.4, { attr: { x: "+=40", y: "+=20" } })
            // }
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

        startPos.h4Birds.sEBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 0.4, { x: "-=80", y: "-=40" })
                .to(bird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px" })
                .to(bird.nativeElement, 0.4, { x: "-=40", y: "-=40" })
            sETl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 0.4, { x: "+=80", y: "+=40" })
                .to(bird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px" })
                .to(bird.nativeElement, 0.4, { x: "+=40", y: "+=40" })
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

        startPos.h4Birds.sWBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 0.4, { x: "+=40", y: "-=80" })
                .to(bird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px" })
                .to(bird.nativeElement, 0.4, { x: "+=40", y: "-=40" })
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nEBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            tl.to(bird.nativeElement, 0.4, { x: "-=40", y: "+=80" })
                .to(bird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px" })
                .to(bird.nativeElement, 0.4, { x: "-=40", y: "+=40" })
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
        birdsInArrayByCardinalPositioning.map(function (birdsByCarinalPosition) {
            birdsByCarinalPosition.map(function (bird, i) {
                let tl = new TimelineMax();
                tl.to(bird.nativeElement, 2, { rotation: "+=270", svgOrigin: 240 * i + xOffset + "px 160px" })
                moveTl.add(tl, 0)
            })
        })
        return moveTl
    }

    // Progression Moves ============================

    public californiaTwirlUpAndDown(startPos) {
        console.log("Hit MOVE californiaTwirl")
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

        startPos.h4Birds.nWBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            if (bird.nativeElement.id[0] === "L") {
                tl.to(bird.nativeElement, 0.6, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 140px" }, "+=0.6")
                    .to(bird.nativeElement, 0.8, { y: "+=40" })
            } else if (bird.nativeElement.id[0] === "R") {
                tl.to(bird.nativeElement, 0.6, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 140px" })
                    .to(bird.nativeElement, 0.8, { y: "+=40" }, "+=0.6")
            }
            nWTl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            if (bird.nativeElement.id[0] === "R") {
                tl.to(bird.nativeElement, 0.6, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 180px" })
                    .to(bird.nativeElement, 0.8, { y: "-=40" }, "+=0.6")
            } else if (bird.nativeElement.id[0] === "L") {
                tl.to(bird.nativeElement, 0.6, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 180px" }, "+=0.6")
                    .to(bird.nativeElement, 0.8, { y: "-=40" })
            }
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nEBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            if (bird.nativeElement.id[0] === "R") {
                tl.to(bird.nativeElement, 0.6, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 140px" })
                    .to(bird.nativeElement, 0.8, { y: "+=40" }, "+=0.6")
            } else if (bird.nativeElement.id[0] === "L") {
                tl.to(bird.nativeElement, 0.6, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 140px" }, "+=0.6")
                    .to(bird.nativeElement, 0.8, { y: "+=40" })
            }
            nETl.add(tl, 0)
        })
        startPos.h4Birds.sEBirds.map(function (bird, i) {
            let tl = new TimelineMax();
            if (bird.nativeElement.id[0] === "L") {
                tl.to(bird.nativeElement, 0.6, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 180px" }, "+=0.6")
                    .to(bird.nativeElement, 0.8, { y: "-=40" })
            } else if (bird.nativeElement.id[0] === "R") {
                tl.to(bird.nativeElement, 0.6, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 180px" })
                    .to(bird.nativeElement, 0.8, { y: "-=40" }, "+=0.6")
            }
            sETl.add(tl, 0)
        })
        return [nETl, sETl, sWTl, nWTl]
    }

    // Accessory Methods for Updating BirdsLocation =======================
    /// Waiting Out and Going in Perpendicular to Direction of Travel =======================

    public sendCouplesOutPerpendicular(birdsLocation) {
        birdsLocation.outBirds.nEBird = birdsLocation.h4Birds.nWBirds.pop();
        birdsLocation.outBirds.sEBird = birdsLocation.h4Birds.sWBirds.pop();
        birdsLocation.outBirds.sWBird = birdsLocation.h4Birds.sEBirds.shift();
        birdsLocation.outBirds.nWBird = birdsLocation.h4Birds.nEBirds.shift();
        return birdsLocation
    }

    public crossoverPerpendicular(birdsLocation) {
        // update out birds (cross them over) who are waiting out perpendicular to direction of travel
        let newNE = birdsLocation.outBirds.sEBird
        let newSE = birdsLocation.outBirds.nEBird
        let newSW = birdsLocation.outBirds.nWBird
        let newNW = birdsLocation.outBirds.sWBird
        birdsLocation.outBirds.nEBird = newNE;
        birdsLocation.outBirds.sEBird = newSE;
        birdsLocation.outBirds.sWBird = newSW;
        birdsLocation.outBirds.nWBird = newNW;
        return birdsLocation
    }

    public incorporateOutCouplesPerpendicular(birdsLocation) {
        birdsLocation.h4Birds.nEBirds.push(birdsLocation.outBirds.nEBird)
        birdsLocation.h4Birds.sEBirds.push(birdsLocation.outBirds.sEBird)
        birdsLocation.h4Birds.sWBirds.unshift(birdsLocation.outBirds.sWBird)
        birdsLocation.h4Birds.nWBirds.unshift(birdsLocation.outBirds.nWBird)
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

    public crossoverPerpendicularAnimation(birdsLocation) {
        // animation for out couples who wait out in Improper or Proper Formation (perpendicular to direction of travel)
        console.log(getComputedStyle(birdsLocation.outBirds.nEBird.nativeElement))
        console.log(birdsLocation)
        console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].x)
        console.log(birdsLocation.outBirds.nEBird.nativeElement.getBoundingClientRect().left) // top corner x axis value
        console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].left)

        console.log(birdsLocation.outBirds.nEBird.nativeElement.getBoundingClientRect().y) // origin?
        console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].y)
        console.log(birdsLocation.outBirds.nEBird.nativeElement.getBoundingClientRect().top) // left corner y axis value
        console.log(birdsLocation.outBirds.nEBird.nativeElement.getClientRects()[0].top)
        let tl = new TimelineMax();
        tl.to(birdsLocation.outBirds.nEBird.nativeElement, 2, { rotation: "-=180", svgOrigin: "620px 160px" }, 0)
            .to(birdsLocation.outBirds.sEBird.nativeElement, 2, { rotation: "+=180", svgOrigin: "620px 160px" }, 0)
            .to(birdsLocation.outBirds.sWBird.nativeElement, 2, { rotation: "-=180", svgOrigin: "20px 160px" }, 0)
            .to(birdsLocation.outBirds.nWBird.nativeElement, 2, { rotation: "+=180", svgOrigin: "20px 160px" }, 0)
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
