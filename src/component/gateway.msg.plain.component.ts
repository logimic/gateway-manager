import { Component, Input } from '@angular/core';
import { GatewayModel, IMessageList, IqrfEmbedLedgSetReq} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-gateway-msg-plain-component',
    templateUrl: 'gateway.msg.plain.component.html',
    styleUrls: ['gateway.msg.plain.component.css']
})
export class GatewayMsgPlainComponent {

    form: FormGroup;

    public cLedgOn: IqrfEmbedLedgSetReq = {
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

    constructor(protected model: GatewayModel, fb: FormBuilder) {
        this.form = fb.group({
            'text': ''
          });
    }

    submit(form) {

        const list: any[] = [
          this.form.controls['text'].value
        ];

        if (list.length > 0) {
            const msg = list[0];

            this.model.sendMessage(list[0]);
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
           this.cLedgOn.data.req.onOff = true;
           this.cLedgOn.data.msgId = 'daemonMgrGreenLedOn';
           msg = JSON.stringify(this.cLedgOn, null, 2);

       } else if (this.mode === 2) {
           this.cLedgOn.data.req.onOff = false;
           this.cLedgOn.data.msgId = 'daemonMgrGreenLedOff';
           msg = JSON.stringify(this.cLedgOn, null, 2);

       }

       this.form.controls['text'].setValue(msg);

    }
}