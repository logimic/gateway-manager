import {Component,  Input, Output, EventEmitter} from '@angular/core';
import { CobaltModel, PointMachine, Point } from '../cobalt/cobalt.model';

/**
 * @title Basic slider
 */
@Component({
  selector: 'app-cobalt-slider',
  templateUrl: 'cobalt.slider.html',
  styleUrls: ['cobalt.slider.css'],
})
export class CobaltSlider {

    value: number = 0;

    @Output() slider: EventEmitter<string> =
    new EventEmitter<string>();
    autoTicks = false;
    disabled = false;
    invert = false;
    max = 100;
    min = 0;
    showTicks = false;
    step = 1;
    thumbLabel = false;
    vertical = false;

  constructor(protected model: CobaltModel) {
}

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : null;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;


  change(slider) {
    this.model.goto(slider.value);
  }

}
