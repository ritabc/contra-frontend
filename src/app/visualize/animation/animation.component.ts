import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { gsap } from 'gsap';

import { Move } from '../../move';
import { Position } from '../../position';
import { Dance } from '../../dance';
import { SnakeToCamelPipe } from '../../snakeToCamel.pipe';
import { ApiService } from '../../api.service';
import { setTimeout } from 'timers';

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
        this.improperFormation()
        // setTimeout(() => {
        //     this.dancersOnRightRightShoulderRoundOnceAndAHalf(this.improperFormation())
        // }, 1500)
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

                let danceTimeline = gsap.timeline()
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
    // Down the line, the page will load with dancers proper and facing the caller. 
    // If a dance starts with improper formation, this function will be called and dancers will take hands four (every other couple crosses over and turns to around) 
    // For now, this function assumes dancers start in improper formation.
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

        birdsLocation.h4Birds.sEBirds.forEach(function (bird, index) {
            let dx = (240 * index + 140).toString() + 'px';
            bird.nativeElement.style.transform = `translate(${dx}, 220px) rotate(180deg)`;
        })
        birdsLocation.h4Birds.nWBirds.forEach(function (bird, index) {
            let dx = (240 * index + 20).toString() + 'px'
            bird.nativeElement.style.transform = `translate(${dx}, 100px)`;
        })
        birdsLocation.h4Birds.nEBirds.forEach(function (bird, index) {
            let dx = (240 * index + 140).toString() + 'px'
            bird.nativeElement.style.transform = `translate(${dx}, 100px) rotate(180deg)`;
        })
        birdsLocation.h4Birds.sWBirds.forEach(function (bird, index) {
            let dx = (240 * index + 20).toString() + 'px'
            bird.nativeElement.style.transform = `translate(${dx}, 220px)`;
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

        let nETl = gsap.timeline();
        let sETl = gsap.timeline();
        let sWTl = gsap.timeline();
        let nWTl = gsap.timeline();

        let negOffset = "-=25"
        let posOffset = "+=25"

        startPos.h4Birds.nEBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { x: negOffset, y: posOffset, rotation: "-=45", transformOrigin: "50% 50%", duration: 1 })
                .to(bird.nativeElement, { x: posOffset, y: negOffset, rotation: "+=45", transformOrigin: "50% 50%", duration: 1 })
            nETl.add(tl, 0)
        })
        startPos.h4Birds.sEBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { x: negOffset, y: negOffset, rotation: "+=45", transformOrigin: "50% 50%", duration: 1 })
                .to(bird.nativeElement, { x: posOffset, y: posOffset, rotation: "-=45", transformOrigin: "50% 50%", duration: 1 })
            sETl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { x: posOffset, y: negOffset, rotation: "-=45", transformOrigin: "50% 50%", duration: 1 })
                .to(bird.nativeElement, { x: negOffset, y: posOffset, rotation: "+=45", transformOrigin: "50% 50%", duration: 1 })
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { x: posOffset, y: posOffset, rotation: "+=45", transformOrigin: "50% 50%", duration: 1 })
                .to(bird.nativeElement, { x: negOffset, y: negOffset, rotation: "-=45", transformOrigin: "50% 50%", duration: 1 })
            nWTl.add(tl, 0)
        })
        return [nETl, sETl, sWTl, nWTl]
    }

    public petronella(startPos) {
        console.log("hit MOVE petronella")
        let nETl = gsap.timeline();
        let sETl = gsap.timeline();
        let sWTl = gsap.timeline();
        let nWTl = gsap.timeline();
        let eeTl = gsap.timeline();

        let negOffset = "-=120"
        let posOffset = "+=120"

        startPos.h4Birds.nEBirds.map(function (bird) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { x: negOffset, rotation: "+=270", transformOrigin: "50% 50%", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
            nETl.add(tl, 0)
        })
        startPos.h4Birds.sEBirds.map(function (bird) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { y: negOffset, rotation: "+=270", transformOrigin: "50% 50%", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
            sETl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (bird) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { x: posOffset, rotation: "+=270", transformOrigin: "50% 50%", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (bird) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { y: posOffset, rotation: "+=270", transformOrigin: "50% 50%", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
            nWTl.add(tl, 0)
        })
        return [nETl, sETl, sWTl, nWTl]
    }

    public swingOnSidesOfSet(startPos) {
        console.log("Hit MOVE swingOnSidesOfSet")
        let nETl = gsap.timeline();
        let sETl = gsap.timeline();
        let sWTl = gsap.timeline();
        let nWTl = gsap.timeline();

        // Set up formula for determining x-value offset (depends on whether couples are out)
        let xOffset
        // if there are couples out
        if ('nEBird' in startPos.outBirds) {
            xOffset = 200;
        } else {// if all couples are in
            xOffset = 80;
        }

        let shortDur = 0.4
        let longDur = 1.2

        startPos.h4Birds.sEBirds.map(function (sEBird, i) {
            let tl = gsap.timeline();
            tl.to(sEBird.nativeElement, { x: "-=40", y: "+=20", rotation: "+=35", transformOrigin: "50% 50%", duration: shortDur })
            if (sEBird.nativeElement.id[0] === 'L') {
                tl.to(sEBird.nativeElement, { rotation: "+=450", svgOrigin: (240 * i + xOffset).toString() + "px 220px", duration: longDur })
                    .to(sEBird.nativeElement, { x: "-=40", y: "-=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            } else if (sEBird.nativeElement.id[0] === 'R') {
                tl.to(sEBird.nativeElement, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 220px", duration: longDur })
                    .to(sEBird.nativeElement, { x: "+=40", y: "+=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            }
            sETl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (sWBird, i) {
            let tl = gsap.timeline();
            tl.to(sWBird.nativeElement, { x: "+=40", y: "-=20", rotation: "+=35", transformOrigin: "50% 50%", duration: shortDur })
            if (sWBird.nativeElement.id[0] === 'R') {
                tl.to(sWBird.nativeElement, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 220px", duration: longDur })
                    .to(sWBird.nativeElement, { x: "+=40", y: "+=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            } else if (sWBird.nativeElement.id[0] === 'L') {
                tl.to(sWBird.nativeElement, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 220px", duration: longDur })
                    .to(sWBird.nativeElement, { x: "-=40", y: "-=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            }
            sWTl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (nWBird, i) {
            let tl = gsap.timeline();
            tl.to(nWBird.nativeElement, { x: "+=40", y: "-=20", rotation: "+=35", transformOrigin: "50% 50%", duration: shortDur })
            if (nWBird.nativeElement.id[0] === 'L') {
                tl.to(nWBird.nativeElement, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 100px", duration: longDur })
                    .to(nWBird.nativeElement, { x: "+=40", y: "+=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            } else if (nWBird.nativeElement.id[0] === 'R') {
                tl.to(nWBird.nativeElement, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 100px", duration: longDur })
                    .to(nWBird.nativeElement, { x: "-=40", y: "-=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            }
            nWTl.add(tl, 0)
        })
        startPos.h4Birds.nEBirds.map(function (nEBird, i) {
            let tl = gsap.timeline();
            tl.to(nEBird.nativeElement, { x: "-=40", y: "+=20", rotation: "+=35", transformOrigin: "50% 50%", duration: shortDur })
            if (nEBird.nativeElement.id[0] === 'R') {
                tl.to(nEBird.nativeElement, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 100", duration: longDur })
                    .to(nEBird.nativeElement, { x: "-=40", y: "-=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            } else if (nEBird.nativeElement.id[0] === 'L') {
                tl.to(nEBird.nativeElement, { rotation: "+=630", svgOrigin: 240 * i + xOffset + "px 100", duration: longDur })
                    .to(nEBird.nativeElement, { x: "+=40", y: "+=20", rotation: "+=55", transformOrigin: "50% 50%", duration: shortDur })
            }
            nETl.add(tl, 0)
        })
        return [nETl, sETl, sWTl, nWTl]
    }

    public dancersOnRightRightShoulderRoundOnceAndAHalf(startPos) {
        console.log("Hit MOVE dancersOnRightRightShoulderRoundOnceAndAHalf")
        let sETl = gsap.timeline();
        let nWTl = gsap.timeline();

        // Set up formula for determining x-value offset (depends on whether couples are out)
        let xOffset
        // if there are couples out
        if ('nEBird' in startPos.outBirds) {
            xOffset = 200;
        } else {// if all couples are in
            xOffset = 80;
        }

        let shortDur = 0.4
        let longDur = 1.2

        startPos.h4Birds.sEBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { x: "-=80", y: "-=40", rotation: "+=135", transformOrigin: "50% 50%", duration: shortDur })
                .to(bird.nativeElement, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px", duration: longDur })
                .to(bird.nativeElement, { x: "-=40", y: "-=40", rotation: "-=45", transformOrigin: "50% 50%", duration: shortDur })
            sETl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            tl.to(bird.nativeElement, { x: "+=80", y: "+=40", rotation: "+=135", transformOrigin: "50% 50%", duration: shortDur })
                .to(bird.nativeElement, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px", duration: longDur })
                .to(bird.nativeElement, { x: "+=40", y: "+=40", rotation: "-=45", transformOrigin: "50% 50%", duration: shortDur })
            nWTl.add(tl, 0)
        })
        return [sETl, nWTl]
    }

    public circleLeftThreeQuarters(startPos) {
        console.log("Hit MOVE circleLeftThreeQuarters")
        let moveTl = gsap.timeline();

        // Set up formula for determining x-value offset (depends on whether couples are out)
        let xOffset
        // if there are couples out
        if ('nEBird' in startPos.outBirds) {
            xOffset = 200;
        } else {// if all couples are in
            xOffset = 80;
        }

        startPos.h4Birds.nEBirds.map(function (bird, i) {
            let tl = gsap.timeline()
            tl.to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { rotation: "+=270", svgOrigin: 240 * i + xOffset + "px 160px", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
            moveTl.add(tl, 0)
        })
        startPos.h4Birds.sEBirds.map(function (bird, i) {
            let tl = gsap.timeline()
            tl.to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { rotation: "+=270", svgOrigin: 240 * i + xOffset + "px 160px", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
            moveTl.add(tl, 0)
        })
        startPos.h4Birds.sWBirds.map(function (bird, i) {
            let tl = gsap.timeline()
            tl.to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { rotation: "+=270", svgOrigin: 240 * i + xOffset + "px 160px", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "-=45", transformOrigin: "50% 50%", duration: 0.3 })
            moveTl.add(tl, 0)
        })
        startPos.h4Birds.nWBirds.map(function (bird, i) {
            let tl = gsap.timeline()
            tl.to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
                .to(bird.nativeElement, { rotation: "+=270", svgOrigin: 240 * i + xOffset + "px 160px", duration: 1.4 })
                .to(bird.nativeElement, { rotation: "+=45", transformOrigin: "50% 50%", duration: 0.3 })
            moveTl.add(tl, 0)
        })

        return moveTl

    }

    // Progression Moves ============================

    public californiaTwirlUpAndDown(startPos) {
        console.log("Hit MOVE californiaTwirl")
        let nETl = gsap.timeline();
        let sETl = gsap.timeline();
        let sWTl = gsap.timeline();
        let nWTl = gsap.timeline();

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
        let shortDur = 0.6
        let longDur = 0.8

        startPos.h4Birds.nWBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            if (bird.nativeElement.id[0] === "L") {
                tl.to(bird.nativeElement, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 140px", duration: shortDur }, `+=${shortDur}`)
                    .to(bird.nativeElement, { y: "+=40", rotation: "+=90", transformOrigin: "50% 50%", duration: longDur })
                // } else if (bird.nativeElement.id[0] === "R") {
                //     tl.to(bird.nativeElement, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 140px", duration: shortDur })
                //         .to(bird.nativeElement, { y: "+=40", duration: longDur }, `+=${shortDur}`)
                // }
                nWTl.add(tl, 0)
            })
        startPos.h4Birds.sWBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            if (bird.nativeElement.id[0] === "R") {
                tl.to(bird.nativeElement, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 180px", duration: shortDur })
                    .to(bird.nativeElement, { y: "-=40", rotation: "-=90", transformOrigin: "50% 50%", duration: longDur }, `+=${shortDur}`)
                // } else if (bird.nativeElement.id[0] === "L") {
                //     tl.to(bird.nativeElement, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForWestBirds + "px 180px", duration: shortDur }, `+=${shortDur}`)
                //         .to(bird.nativeElement, { y: "-=40", duration: longDur })
                // }
                sWTl.add(tl, 0)
            })
        startPos.h4Birds.nEBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            if (bird.nativeElement.id[0] === "R") {
                tl.to(bird.nativeElement, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 140px", duration: shortDur })
                    .to(bird.nativeElement, { y: "+=40", rotation: "+=90", transformOrigin: "50% 50%", duration: longDur }, `+=${shortDur}`)
                // } else if (bird.nativeElement.id[0] === "L") {
                //     tl.to(bird.nativeElement, { rotation: "+=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 140px", duration: shortDur }, `+=${shortDur}`)
                //         .to(bird.nativeElement, { y: "+=40", duration: longDur })
                // }
                nETl.add(tl, 0)
            })
        startPos.h4Birds.sEBirds.map(function (bird, i) {
            let tl = gsap.timeline();
            if (bird.nativeElement.id[0] === "L") {
                tl.to(bird.nativeElement, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 180px", duration: shortDur }, `+=${shortDur}`)
                    .to(bird.nativeElement, { y: "-=40", rotation: "-=90", transformOrigin: "50% 50%", duration: longDur })
                // } else if (bird.nativeElement.id[0] === "R") {
                //     tl.to(bird.nativeElement, { rotation: "-=90", svgOrigin: 240 * i + xOffsetForEastBirds + "px 180px", duration: shortDur })
                //         .to(bird.nativeElement, { y: "-=40", duration: longDur }, `+=${shortDur}`)
                // }
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
        let tl = gsap.timeline();
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


// Unfinished Methods ==========================================
 // public dancersOnLeftRightShoulderRoundOnceAndAHalf(startPos) {
    //     console.log("Hit MOVE dancersOnLeftRightShoulderRoundOnceAndAHalf")
    //     let sWTl = gsap.timeline();
    //     let nETl = gsap.timeline();

    //     // Set up formula for determining x-value offset (depends on whether couples are out)
    //     let xOffset
    //     // if there are couples out
    //     if ('nEBird' in startPos.outBirds) {
    //         xOffset = 200;
    //     } else {// if all couples are in
    //         xOffset = 80;
    //     }

    //     startPos.h4Birds.sWBirds.map(function (bird, i) {
    //         let tl = gsap.timeline();
    //         tl.to(bird.nativeElement, 0.4, { x: "+=40", y: "-=80" })
    //             .to(bird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px" })
    //             .to(bird.nativeElement, 0.4, { x: "+=40", y: "-=40" })
    //         sWTl.add(tl, 0)
    //     })
    //     startPos.h4Birds.nEBirds.map(function (bird, i) {
    //         let tl = gsap.timeline();
    //         tl.to(bird.nativeElement, 0.4, { x: "-=40", y: "+=80" })
    //             .to(bird.nativeElement, 1.2, { rotation: "+=450", svgOrigin: 240 * i + xOffset + "px 160px" })
    //             .to(bird.nativeElement, 0.4, { x: "-=40", y: "+=40" })
    //         nETl.add(tl, 0)
    //     })
    //     return [nETl, sWTl]
    // }

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
// console.log(bird.nativeElement.getBBox())
