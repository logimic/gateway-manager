import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-cobalt-direction-button',
    template: `<img src="./theme/cube-{{type}}.png" (click)="onClick($event)" />`
})
export class CobaltDirectionButtonComponent {
    @Input()
    type = 'x';

    @Output()
    click: EventEmitter<any> = new EventEmitter<any>();

    onClick(e: any): void {
        this.click.next(e);
    }
}
