import { Component, Input } from '@angular/core';
import { GatewayModel} from '../gateway/gateway.model';

@Component({
    selector: 'app-gateway-status-component',
    templateUrl: 'gateway.status.component.html'
})
export class GatewayStatusComponent {

    public gwmVersion = 'v0.0.1';
    public gwmLastupdate = 'Apr-2018';
    public apiVersion = '1-0-0';
    public wsserver = 'ws://127.0.0.1:1338';
    public wsprotocol = 'iqrf';
/*
    @Input()
    public P: Point = {x: 10, y: 20.6, z: 30};

    @Input()
    public A: Point = {x: 0, y: 0, z: 0};

    @Input()
    public a: IF6 = {f1: 0, f2: 0, f3: 0, f4: 0, f5: 0, f6: 0};
*/

    @Input()
    public onlineStatus = true;

    constructor() {
    }
}
