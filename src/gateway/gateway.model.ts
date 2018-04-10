
import { Injectable, EventEmitter } from '@angular/core';
import { GatewayService } from './gateway.service';
// import { ISTLFacets, StlService } from '../webgl/stl.service';
import { Observable } from 'rxjs/Rx';


export interface ServerStatus {
    cncStatus: number;      // status cnc core
    systemStatus: number;   // status server system
}

export class Status  {
    public serverStatus: ServerStatus; // Server status from websockets
    public onlineStatus= false; // Indicates if we have connection with server
    public mode = 0; // 0-control mode; 1-learning mode
    public cncFile = ' ';
    public jsonFile = ' ';
    public trajReachable = false;
    public message = '';
    public trajReady; // trajectory is loaded and has at least one segment
    public manTrajsOn = false;  // Sets visible manual trajs...
}

export interface JsonMsgData {
    msgId: string;
    timeout: number;
    status: number;
}

export interface JsonMsg {
    mType: string;
    data: JsonMsgData;
}

export class Msg {
    req: any;
    resp: any; // JSON object message
}

export interface IMessageList {
    messages: string[];
}


export interface CoordState {
    ledg: boolean;
    ledr: boolean;
}

export interface IqrfEmbedLedgSetReq {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        req: {
            nAdr: number;
            hwpId: number;
            onOff: boolean;
        };
        returnVerbose: boolean;
    };
}

export interface IqrfEmbedLedgSetResp {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        rsp: {
            nAdr: number;
            hwpId: number;
            rCode: number;
            dpaVal: number;
        };
        insId: string;
        status: number;
        statusStr: string;
    };
}

export interface IqrfEmbedLedrSetReq {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        req: {
            nAdr: number;
            hwpId: number;
            onOff: boolean;
        };
        returnVerbose: boolean;
    };
}

export interface IqrfEmbedLedrSetResp {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        rsp: {
            nAdr: number;
            hwpId: number;
            rCode: number;
            dpaVal: number;
        };
        insId: string;
        status: number;
        statusStr: string;
    };
}

export interface IqrfEmbedLedgGetReq {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        req: {
            nAdr: number;
            hwpId: number;
        };
        returnVerbose: boolean;
    };
}

export interface IqrfEmbedLedgGetResp {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        rsp: {
            nAdr: number;
            hwpId: number;
            rCode: number;
            dpaVal: number;
            onOff: boolean;
        };
        insId: string;
        status: number;
        statusStr: string;
    };
}

export interface IqrfEmbedLedrGetReq {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        req: {
            nAdr: number;
            hwpId: number;
        };
        returnVerbose: boolean;
    };
}

export interface IqrfEmbedLedrGetResp {
    mType: string;
    data: {
        msgId: string;
        timeout: number;
        rsp: {
            nAdr: number;
            hwpId: number;
            rCode: number;
            dpaVal: number;
            onOff: boolean;
        };
        insId: string;
        status: number;
        statusStr: string;
    };
}

export interface ConfigWS {
    wsServer: string;
    wsProtocol: string;
    valid: boolean;
}

/* hold information transmitted by websocket*/
@Injectable()
export class GatewayModel  {

    public ready = false;

    // Default/Initial; status
    public status: Status = {
        serverStatus: {cncStatus: 0, systemStatus: 0},
        onlineStatus: false,
        mode: 0,
        cncFile: '',
        jsonFile: '',
        trajReachable: false,
        message: '',
        trajReady: false,
        manTrajsOn: false
    };

    public cfg: ConfigWS = {
        wsServer: '-',
        wsProtocol: '-',
        valid: false
    };

    msgArray: Msg[];

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

    public cLedrOn: IqrfEmbedLedrSetReq = {
        mType: 'iqrfEmbedLedr_Set',
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

    public coordState: CoordState = {
        ledg: false,
        ledr: false
    };

    public emitorCoordState$: EventEmitter<CoordState> = new EventEmitter();

    constructor ( protected service: GatewayService) {

        this.msgArray = new Array();

        service.emitorOnlineStatus$.subscribe( w => {
            this.status.onlineStatus = w;
        });

        service.emitorMessage3$.subscribe( w => {
            this.receivedMessage(w);
        });

        service.emitorCfg$.subscribe( w => {
            this.cfg = w;
        });

        // Set init state as control
        this.status.mode = 0;

        setTimeout(() => {
            this.ready = true;
        }, 500);

    }

    public isReady() {
        return this.ready;
    }

    private OnSendMessage(data: any): void {
        this.service.send(data);
    }

    private OnMsgReceived(msg: Msg) {

    }

    /*
    * Converts JSON to string.
    */
    public msgString (json: any): string {
        return JSON.stringify( json, null, 2);
    }

    /*
    *
    * This sends message to gateway.
    */
    public sendMessage(msg: string) {
        const m = new Msg();
        try {
            m.req = JSON.parse(msg);
            this.msgArray.push(m);
            this.service.send(msg);
        }catch (e) {
            window.alert('Send message Exception:' + e);
        }
     }

    /*
    *
    * This recieves message from gateway.
    */
    public receivedMessage(msg: any) {
        const m = new Msg();
        try {
            m.resp = JSON.parse(msg.data);
            if (this.msgArray.length > 0) {

                const lastReq = this.msgArray[this.msgArray.length - 1].req;

                if (m.resp.data.msgId === lastReq.data.msgId) {
                    this.msgArray[this.msgArray.length - 1].resp = m.resp;
                } else {
                    window.alert('***');
                    this.msgArray.push(m);
                }

            } else {
                this.msgArray.push(m);
            }

        }catch (e) {
            window.alert('Receive message Exception:' + e);

        }



    }
}
