import { Component, Input } from '@angular/core';
import { GatewayModel, IMessageList} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as iqrfApi from '../gateway/iqrf-api';

@Component({
    selector: 'app-gateway-msg-plain-component',
    templateUrl: 'gateway.msg.plain.component.html',
    styleUrls: ['gateway.msg.plain.component.css']
})
export class GatewayMsgPlainComponent {

    form: FormGroup;

    public msgList: IMessageList = {
        messages: [ 'none', 'Concentrator Green LED-on', 'Concentrator Green LED-off',
                    'Concentrator Red LED-on', 'Concentrator Red LED-off']
    };

    public mode = 0;

    constructor(protected service: GatewayService, fb: FormBuilder) {
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

            this.service.sendMessage(list[0]);
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

        if (this.mode === 0) { return; }

       // window.alert('MODE: ' + this.mode);

       let msg = '';

       if (this.mode === 1) {
           const req: iqrfApi.IqrfEmbedLedgSetRequest100 = {
               mType: 'iqrfEmbedLedg_Set',
               data: {
                   msgId: 'plain message',
                   req: {
                       nAdr: 0,
                       onOff: true
                   }
               }
           };

           msg = JSON.stringify(req, null, 2);
       } else if (this.mode === 2) {
            const req: iqrfApi.IqrfEmbedLedgSetRequest100 = {
                mType: 'iqrfEmbedLedg_Set',
                data: {
                    msgId: 'plain message',
                    req: {
                        nAdr: 0,
                        onOff: false
                    }
                }
            };

            msg = JSON.stringify(req, null, 2);
       } else if (this.mode === 3) {
            const req: iqrfApi.IqrfEmbedLedrSetRequest100 = {
                mType: 'iqrfEmbedLedr_Set',
                data: {
                    msgId: 'plain message',
                    req: {
                        nAdr: 0,
                        onOff: true
                    }
                }
            };

        msg = JSON.stringify(req, null, 2);
    } else if (this.mode === 4) {
        const req: iqrfApi.IqrfEmbedLedrSetRequest100 = {
            mType: 'iqrfEmbedLedr_Set',
            data: {
                msgId: 'plain message',
                req: {
                    nAdr: 0,
                    onOff: false
                }
            }
        };

        msg = JSON.stringify(req, null, 2);
   }

       this.form.controls['text'].setValue(msg);
    }
}
