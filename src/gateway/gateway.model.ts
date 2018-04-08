
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
    json: JsonMsg;
    str: string;
    strReq: string;
}

export interface IMessageList {
    messages: string[];
}

export interface IqrfEmbedLedgSet {
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

    // Current msg...
    //public msg: JsonMsg;
    //public msgStr: String;

    // Array of messages
   // public record: Records;
    msgArray: Msg[];
    msgRequest = '';


    constructor ( protected service: GatewayService) {

        this.msgArray = new Array();

        service.emitorOnlineStatus$.subscribe( w => {
            this.status.onlineStatus = w;
        });

        service.emitorMessage$.subscribe( w => {

            const m = new Msg();
            m.json = w;
            m.str = JSON.stringify(w, null, 2);
            m.strReq = this.msgRequest;

            //window.alert('-->xx:' + this.msgRequest);

            this.msgArray.push(m);
        //    this.msgArrayStr.push(JSON.stringify(w));
           // this.record.msgArray.push(this.msg);
            this.OnMsgReceived();
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

    private OnMsgReceived() {
      //  window.alert('MSG: ' + this.msgArray[this.msgArray.length - 1].json.mType);
       //window.alert('MSG: ' + this.msgArrayStr[this.msgArray.length - 1]);
    }

}
