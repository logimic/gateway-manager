import { Component, Input, Output, EventEmitter } from '@angular/core';
//import { CobaltModel, PointMachine, Point, IF6 } from '../cobalt/cobalt.model';

@Component({
    selector: 'app-message-panel-component',
    templateUrl: 'message.panel.component.html'
})
export class MessagePanelComponent {

    @Input()
    public message: ' ';

    constructor() {
    }
}
