import { Component } from '@angular/core';
import { CobaltModel, PointMachine, Point } from '../cobalt/cobalt.model';

@Component({
    selector: 'app-cobalt-panel',
    templateUrl: 'cobalt.panel.html'
})

export class CobaltPanelComponent {

    constructor(protected model: CobaltModel) {
    }

    public isVisible(): boolean {
        return false; // this.model.isReady();
    }

    public isRecording(): boolean {
        return false; // this.model.isRecording();
    }

    public playLabel(): string {
        return ''; // this.model.isPlaying() ? "glyphicon glyphicon-pause":"glyphicon glyphicon-play";
    }

    OnRecordClick(): void {
        // this.model.toggleRecording();
    }

    OnPlayClick(): void {
        /*
        if(this.model.isPlaying()){
            this.model.pause();
        }
        else{
            this.model.play();
        }
        */
    }

    OnStopClick(): void {
       // this.model.stop();
    }

    OnStepLeft(): void {
       // this.model.gotoLeft();
    }

    OnStepRight(): void {
       // this.model.gotoRight();
    }
}
