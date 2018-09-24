import { Component, Input } from '@angular/core';
import { GatewayModel, IMessageList} from '../gateway/gateway.model';
import { GatewayService } from '../gateway/gateway.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as iqrfApi from '../gateway/iqrf-api';

@Component({
    selector: 'app-gateway-zwave-adapter-component',
    templateUrl: 'gateway.zwave.adapter.component.html',
    styleUrls: ['gateway.zwave.adapter.component.css']
})
export class GatewayZwaveAdapterComponent {

  //  public modeList: string[] = ['Plain message', 'IQRF Coordinator'];
  //  public mode = 0;

  public adapterReady = false;

    form: FormGroup;

    public mode = 0;

    selMessageMode = 'Plain message';
    messageMode: string[] = ['Plain message', 'IQRF Coordinator'];

    public msgList: IMessageList = {
        messages: [ 'none', 'Concentrator Green LED-on', 'Concentrator Green LED-off',
                    'Concentrator Red LED-on', 'Concentrator Red LED-off']
    };

    constructor(protected service: GatewayService, protected model: GatewayModel, fb: FormBuilder) {
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

    OnControlModeClick1(selection): void {

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
