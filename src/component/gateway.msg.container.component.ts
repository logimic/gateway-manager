import { Component, Input } from '@angular/core';
import { GatewayModel, IqrfEmbedLedgSetReq} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-gateway-msg-container-component',
    templateUrl: 'gateway.msg.container.component.html',
    styleUrls: ['gateway.msg.container.component.css']
})
export class GatewayMsgContainerComponent {


    public modeList: string[] = ['Plain message'];
    public mode = 0;

    constructor(protected service: GatewayService, protected model: GatewayModel, fb: FormBuilder) {

    }


    OnControlModeClick(selection): void {

        this.mode = selection.value;

       // window.alert('MODE: ' + this.mode);

     //  let msg = '';


    }
}
