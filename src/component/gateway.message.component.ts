import { Component, Input } from '@angular/core';
import { GatewayModel} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-gateway-message-component',
    templateUrl: 'gateway.message.component.html',
    styleUrls: ['gateway.message.component.css']
})
export class GatewayMessageComponent {

    form: FormGroup;

    constructor(protected service: GatewayService, protected model: GatewayModel, fb: FormBuilder) {
        this.form = fb.group({
            'text': ''
          });
    }

    OnClick(data: any): void {
        this.service.send(data);
    }

    OnSend(e: any): void {
        this.OnClick(JSON.stringify({
            'data': {
            'command': 'cnc/startFwd'
            }
        }));
    }

    submit(form) {

        const list: any[] = [
          this.form.controls['text'].value
        ];

        if (list.length > 0) {
           // window.alert('submit:' + list[0]);

           this.service.send(list[0]);

        }
      }

    cancel(form) {


        window.alert('cancel');
    }
}
