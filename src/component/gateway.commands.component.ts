import { Component, Input } from '@angular/core';
import { GatewayModel} from '../gateway/gateway.model';

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

    constructor() {
    }
}
