import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../api.service';

import { Dance } from '../../dance'
import { Move } from '../../move'
import { Position } from '../../position'

@Component({
    selector: 'app-choose-dance',
    templateUrl: './choose-dance.component.html',
    styleUrls: ['./choose-dance.component.css'],
    providers: [ApiService]
})
export class ChooseDanceComponent implements OnInit {
    public allDances: Dance[] = [];
    private internalDanceId
    private steps: Array<Move | Position> = [];
    @Output() danceStepsFromChooseDance: EventEmitter<any> = new EventEmitter();
    @Output() danceIdFromChooseDance: EventEmitter<any> = new EventEmitter();

    // @Output() chooseDanceToOutput: EventEmitter<number> = new EventEmitter();

    constructor(public apiService: ApiService) { }

    ngOnInit() {
        this.apiService.getAllDances("dances").subscribe((danceData) => {
            danceData.forEach(function (dance) {
                this.allDances.push(new Dance(dance.id, dance.name, dance.writer, dance.description, dance.isBecket, dance.outCouplesWaitingPosition))
            }, this)
        })
    }

    // Upon click of DanceName button, the ID and Steps of the chosen dance will be emitted.
    public emitDanceIdFromChosenDance(event) {
        // this.internalDanceId = event.path[0].id // doesn't work on Firefox
        this.internalDanceId = event.detail
        this.danceIdFromChooseDance.emit(this.internalDanceId)
    }

    // We have an array of danceMoves, say(each danceMove is comprised of a move prop and endingPositionProp)
    // push each steps's move
    // push each steps's endingPos
    // shift in the last steps's endingPos as first pos, with isFormation === true
    public emitStepsFromChosenDance(event) {
        this.apiService.getSteps(this.internalDanceId).subscribe((stepsData) => {
            stepsData.forEach(function (step, i) {
                let move = new Move(step['move'].id, step['move']['name'])
                let position = new Position(step['endingPosition'].id, false, step['endingPosition']['description'])
                this.steps.push(move)
                this.steps.push(position)
                if (i === stepsData.length - 1) {
                    let formation = new Position(step['endingPosition'].id, true, step['endingPosition']['description'])
                    this.steps.unshift(formation)
                }
            }, this)
            this.danceStepsFromChooseDance.emit(this.steps)
        }
    };
}
