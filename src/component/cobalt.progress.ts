import { Component } from '@angular/core'
import { CobaltModel, PointMachine, Point } from '../cobalt/cobalt.model';

@Component({
    selector:'cobalt-progress',
    template:`
    <div *ngIf="isVisible()"
        class="progress" (click)="OnClickProgress(progressElement, $event)" #progressElement>
        <div class="progress-bar" role="progressbar" aria-valuenow="70"
        aria-valuemin="0" aria-valuemax="100" [style.width]="getPercentStyle()" >
        </div>
    </div>
    `
})
export class CobaltProgressComponent{

    constructor(protected model:CobaltModel){
    }

    public isVisible():boolean{
        return false; //!this.model.isRecording();
    }

    public getPercent():number{
        /*
        if(!this.model.isRecording() &&
            this.model.getRecordCount() > 1){
            return 100.0 * this.model.getRecordIndex() / (this.model.getRecordCount() - 1);
        }
        */

        return 0;
    }

    public getPercentStyle():string{
        var num = Math.round(this.getPercent());
        var str = `${num}%`;
        return str;
    }

    OnClickProgress(element:any, e:any):void{
        this.model.goto( 
                Math.round( 
            e.offsetX / element.offsetWidth * (this.model.getRecordCount()-1)
            )
        );
        
    }
}