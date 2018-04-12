import * as iqrfApi from './iqrf-api';
import { GatewayService } from './gateway.service';

export class Coordinator {

    protected ledG = false;
    protected ledR = false;

    constructor(protected service: GatewayService) {

    }

    public getLedG (): boolean {
        return this.ledG;
    }

    public setLedG (state: boolean): void {
        this.ledG = state;
    }

    public getLedR (): boolean {
        return this.ledR;
    }

    public setLedR (state: boolean): void {
        this.ledR = state;
    }

    public reqSetLedG (state: boolean): void {

        const req: iqrfApi.IqrfEmbedLedgSetRequest100 = {
            mType: 'iqrfEmbedLedgSet',
            data: {
                msgId: 'sss',
                req: {
                    nAdr: 0,
                    onOff: state
                }
            }
        };

        this.service.send(req);
    }

    public reqGetLedG (state: boolean): void {

        const req: iqrfApi.IqrfEmbedLedgGetRequest100 = {
            mType: 'iqrfEmbedLedgGet',
            data: {
                msgId: 'sss',
                req: {
                    nAdr: 0,
                    onOff: state
                }
            }
        };

        this.service.send(req);
    }
}
