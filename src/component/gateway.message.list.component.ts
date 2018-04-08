import { Component, Input } from '@angular/core';
import { GatewayModel} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableModule} from '@angular/material';


@Component({
    selector: 'app-gateway-message-list-component',
    templateUrl: 'gateway.message.list.component.html',
    styleUrls: ['gateway.message.list.component.css']
})
export class GatewayMessageListComponent {

    constructor(protected service: GatewayService, protected model: GatewayModel) {

    }

    OnClearMsgs () {

       // window.alert('cccc');
       this.model.msgArray.length = 0;
    }
}
