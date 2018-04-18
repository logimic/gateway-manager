import * as iqrfApi from './iqrf-api';
import { GatewayService } from './gateway.service';

export class Coordinator {

    protected ledG = false;
    protected ledR = false;

    public switchG = false;
    public switchR = false;

    protected tmp = false;

    constructor(protected service: GatewayService) {

    }

    public getLedG (): boolean {
        return this.ledG;
    }

    public getLedR (): boolean {
        return this.ledR;
    }

    public setData (json: any) {

        if (json.mType === 'iqrfEmbedLedg_Get') {
            const msg = json as iqrfApi.IqrfEmbedLedgGetResponse100;

            if (msg.data.rsp.nAdr === 0) {
                this.ledG = msg.data.rsp.onOff;
            }
        }

    }
    public setLedG (state: boolean): void {
        const req: iqrfApi.IqrfEmbedLedgSetRequest100 = {
            mType: 'iqrfEmbedLedg_Set',
            data: {
                msgId: 'sss',
                req: {
                    nAdr: 0,
                    onOff: state
                }
            }
        };

        this.service.sendMessage(JSON.stringify(req, null, 2));

        // Update status
        window.setTimeout(() => this.reqLedG(), 20);

        /*
       this.switchG = state;

       window.setTimeout(() => this.easy(), 500);
       */
    }

    public easy () {
        this.switchG = false; //this.tmp;
    }
    public reqLedG (): void {

        const req: iqrfApi.IqrfEmbedLedgGetRequest100 = {
            mType: 'iqrfEmbedLedg_Get',
            data: {
                msgId: 'sss',
                req: {
                    nAdr: 0
                }
            }
        };

        this.service.sendMessage(JSON.stringify(req, null, 2));
    }
}
