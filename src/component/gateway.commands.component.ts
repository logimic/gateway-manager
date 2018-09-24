import { Component, Input } from '@angular/core';
import { GatewayModel} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import * as oegwApi from '../gateway/oegw-api';

@Component({
    selector: 'app-gateway-commands-component',
    templateUrl: 'gateway.commands.component.html'
})
export class GatewayCommandsComponent {

/*
    @Input()
    public P: Point = {x: 10, y: 20.6, z: 30};

    @Input()
    public A: Point = {x: 0, y: 0, z: 0};

    @Input()
    public a: IF6 = {f1: 0, f2: 0, f3: 0, f4: 0, f5: 0, f6: 0};
*/
    @Input()
    public Speed = 0;

    @Input()
    public onlineStatus = false;

    constructor(protected service: GatewayService, protected model: GatewayModel) {
    }

    OnScriptSelect(selection): void {

        const sel = selection.value;

        const msg = {
            mCat: 'LoadScript',
            script: `
            oegw.script.make = function (param) {\n    return 'no result';\n};\n
        `
        };

        const msg1 = {
            mCat: 'LoadScript',
            script: `
            oegw.script.make = function (param) {

                param.output0.output = false;
                param.output1.output = false;

                if (param.FaceRecognition.faces.length > 0) {
                    if (param.FaceRecognition.faces[0].maleProb < 0.5) {
                        param.output0.output = true;
                    }
                    else {
                        param.output1.output = true;
                    }
                }

                return param;
            };
        `
        };

        const msg2 = {
            mCat: 'LoadScript',
            script: `
            oegw.script.make = function (param) {

                param.output0.output = false;
                param.output1.output = false;

                var len = param.FaceRecognition.faces.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        param.output0.output = false;
                        param.output1.output = true;
                        if (param.FaceRecognition.faces[i].age < 18) {
                            param.output0.output = true;
                            param.output1.output = false;
                            break;
                        }
                    }
                }

                return param;
            };
        `
        };

        if (sel === 0) {
            this.service.sendMessage(JSON.stringify(msg1));
        } else {
            this.service.sendMessage(JSON.stringify(msg2));
        }


      }

    OnSelectCommDevice(e) {

        //window.alert('aaa: ' + e.value);


        if (e.value === 0) {


        }

    }
}
