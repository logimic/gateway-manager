import { Component, Input } from '@angular/core';
import { GatewayModel, IMessageList, IqrfEmbedLedgSet} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-gateway-message-component',
    templateUrl: 'gateway.message.component.html',
    styleUrls: ['gateway.message.component.css']
})
export class GatewayMessageComponent {

    form: FormGroup;

    public cLedOn: IqrfEmbedLedgSet = {
        mType: 'iqrfEmbedLedg_Set',
        data: {
          msgId: 'nostrud exercitation Ut est',
          timeout: 0,
          req: {
            nAdr: 0,
            hwpId: 0,
            onOff: true
          },
          returnVerbose: true
        }
    };

    public msgList: IMessageList = {
        messages: [ 'none', 'Concentrator Green LED-on', 'Concentrator Green LED-off']
    };

    public mode = 0;

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

           const msg = list[0];

           this.model.msgRequest = msg;

          // window.alert('-->' + this.model.msgRequest);

           this.service.send(list[0]);
        }
      }

    cancel(form) {
        window.alert('cancel');
    }

    reset(form) {
       // window.alert('reset');
        this.form.controls['text'].setValue('');

      }

    OnControlModeClick(selection): void {

        this.mode = selection.value;

       // window.alert('MODE: ' + this.mode);

       let msg = '';

       if (this.mode === 1) {
           this.cLedOn.data.req.onOff = true;
           this.cLedOn.data.msgId = 'daemonMgrGreenLedOn';
           msg = JSON.stringify(this.cLedOn, null, 2);

       } else if (this.mode === 2) {
           this.cLedOn.data.req.onOff = false;
           this.cLedOn.data.msgId = 'daemonMgrGreenLedOff';
           msg = JSON.stringify(this.cLedOn, null, 2);

       }

       this.form.controls['text'].setValue(msg);

    }
}
