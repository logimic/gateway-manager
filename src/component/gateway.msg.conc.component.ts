import { Component, Input } from '@angular/core';
import { GatewayModel, IMessageList, CoordState } from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-gateway-msg-conc-component',
    templateUrl: 'gateway.msg.conc.component.html',
    styleUrls: ['gateway.msg.conc.component.css']
})
export class GatewayMsgConcComponent {

  //  ledg = true;
//    ledr = true;

  //  public coordState: CoordState = {
      //  ledg: false,
     //   ledr: false
  //  };

    public msgList: IMessageList = {
        messages: [ 'none', 'Concentrator Green LED-on', 'Concentrator Green LED-off']
    };

    public mode = 1;

    constructor(protected model: GatewayModel) {
/*
        model.emitorCoordState$.subscribe( w => {
            this.coordState = w;
            window.alert('ok');
        });
*/
    }

    OnLedG(selection): void {
        if (selection.checked === true) {
            this.model.coordinator.switchG = true;
        } else {
            this.model.coordinator.switchG = false;
        }

        this.model.coordinator.setLedG(this.model.coordinator.switchG);
    }

    OnLedR(selection): void {
      //  window.alert('...set...');
       // this.ledr = selection.checked;
    }
}
