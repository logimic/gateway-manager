import { Component, Input, Output, EventEmitter } from '@angular/core';

export class DirectionEvent {
    public static x = 0;
    public static y = 1;
    public static z = 2;
    public static c = 3;

    protected _event: number;

    public constructor(e: number) {
        this._event = e;
    }

    public isX(): boolean {
        return this._event === DirectionEvent.x;
    }

    public isY(): boolean {
        return this._event === DirectionEvent.y;
    }

    public isZ(): boolean {
        return this._event === DirectionEvent.z;
    }

    public isCommon(): boolean {
        return this._event === DirectionEvent.c;
    }
}

@Component({
    selector: 'app-cobalt-zoom-direction',
    templateUrl: 'zoom.direction.component.html'
})
export class ZoomDirectionComponent {

    @Output()
    public directionChange: EventEmitter<DirectionEvent> = new EventEmitter<DirectionEvent>()

    // x orientation
    SetX(): void {
        this.directionChange.next(new DirectionEvent(DirectionEvent.x));
    }

    // y orientation
    SetY(): void {
        this.directionChange.next(new DirectionEvent(DirectionEvent.y));
    }

    // z orientation
    SetZ(): void {
        this.directionChange.next(new DirectionEvent(DirectionEvent.z));
    }

    // common orientation
    SetCommon(): void {
        this.directionChange.next(new DirectionEvent(DirectionEvent.c));
    }
}
