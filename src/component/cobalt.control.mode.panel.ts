import { Component } from '@angular/core';
import { CobaltModel, PointMachine, Point } from '../cobalt/cobalt.model';
import { CobaltService } from '../cobalt/cobalt.service';

@Component({
    selector: 'app-cobalt-control-mode-panel',
    templateUrl: 'cobalt.control.mode.panel.html',
    styleUrls: ['cobalt.control.mode.panel.css']
})
export class CobaltControlModeComponent {

   public run = false;

    constructor(protected service: CobaltService, protected model: CobaltModel) {

    }

    OnClick(data: any): void {
        this.service.send(data);
    }

    OnStartClick(e: any): void {
        this.run = true;
        this.OnClick(JSON.stringify({
            'data': {
            'command': 'cnc/startFwd'
            }
        }));
    }

    OnStopClick(e: any): void {
        this.run = false;
        this.OnClick(JSON.stringify(
            {
                'data': {
                'command': 'cnc/stop'
                }
            }
        ));
    }

    OnBackClick(e: any): void {
        this.OnClick(JSON.stringify(
            {
                'data': {
                'command': 'cnc/startBwd'
                }
            }
        ));
    }

    OnResetClick(e: any): void {
        this.OnClick(JSON.stringify({
            'data': {
            'command': 'cnc/reset'
            }
        }));
    }

    OnSwitchClick(e: any): void {
        // window.alert('DOWN');
        if (this.model.status.manTrajsOn) {
            this.model.status.manTrajsOn = false;
        } else {
            this.model.status.manTrajsOn = true;

            this.OnClick(JSON.stringify(
                {
                    'data': {
                    'command': 'manualTrajX'
                    }
                }
            ));

            this.OnClick(JSON.stringify(
                {
                    'data': {
                    'command': 'manualTrajY'
                    }
                }
            ));

            this.OnClick(JSON.stringify(
                {
                    'data': {
                    'command': 'manualTrajZ'
                    }
                }
            ));
        }
      }


    OnManDown(e: any): void {
      // window.alert('DOWN');
    }

    OnManUp(e: any): void {
        window.alert('UP');
     }
}
