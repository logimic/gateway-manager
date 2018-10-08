
import { Injectable, EventEmitter } from '@angular/core';
import { GatewayService } from './gateway.service';
// import { ISTLFacets, StlService } from '../webgl/stl.service';
import { Observable } from 'rxjs/Rx';
import { Coordinator } from './gateway.model.coordinator';
import * as iqrfApi from './iqrf-api';
import * as oegwApi from './oegw-api';
import * as oegwThings from './oegw-things';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

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

export interface IMessageList {
    messages: string [];
}

export interface CoordState {
    ledg: boolean;
    ledr: boolean;
}

/*
export interface ConfigWS {
    wsServer: string;
    wsProtocol: string;
    valid: boolean;
}
*/
export interface ConfigWS {
    wsServer: string;
    wsIP: string;
    wsPort: string;
    detectServer: boolean;
    valid: boolean;
}
/* hold information transmitted by websocket*/
@Injectable()
export class GatewayModel  {

    // oegw API
    // public DownloadScriptRequest100: oegwApi.DownloadScriptRequest100 = null;
    //public scenarios: oegwApi.GatewayScenario100[];

    // Gateway Things...
    public coordinator: Coordinator = null;

    public scenarioList: oegwThings.OegwScenarioList = {
        list: [
            {name: '999',
            scenario: 'ssss'}
            ],
            activeScenario: ''
    };

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
        wsIP: '-',
        wsPort: '-',
        detectServer: false,
        valid: false
    };


    public coordState: CoordState = {
        ledg: false,
        ledr: false
    };


    public emitorCoordState$: EventEmitter<CoordState> = new EventEmitter();


    // Device for communication...
    selCommDevice: string;
    commDevice: string[] = ['Gateway', 'IQRF adapter', 'Z-wave adapter'];


    constructor (protected service: GatewayService) {

        this.coordinator =  new Coordinator(service);

      //  this.scenarioList = new Lists();
     //   this.scenarioList.scenarios = new Array();
     //   this.scenarioList.scenarios = new Array();

      //  const simpleObject = {} as iqrfApi.CfgDaemonComponentRequest100;
      //  let ff = {} as iqrfApi.CfgDaemonComponentRequest100;
      // ff.data.msgId = '----';

        service.emitorOnlineStatus$.subscribe( w => {
            this.status.onlineStatus = w;
        });

        service.emitorMessage$.subscribe( w => {
            // this.receivedMessage(w);
            this.parseIncomingMsg(w);
        });

        service.emitorWsOegw$.subscribe( w => {
            this.cfg = w;
        });

        // Set init state as control
        this.status.mode = 0;
        this.selCommDevice = 'Gateway';

        setTimeout(() => {
            this.ready = true;
        }, 500);

        this.initScenarios();
    }

    public isReady() {
        return this.ready;
    }

    public initScenarios() {

        this.scenarioList.list.length = 0;

        const scenario1: oegwThings.OegwScenario = {
            name: 'script1.js',
            scenario: `
                oegw.script.make = function (param) {
                param.output0.output = false;
                param.output1.output = false;

                if (param.FaceRecognition.faces.length > 0) {
                    if (param.FaceRecognition.faces[0].maleProb < 0.5) {
                        param.output0.output = true;
                    }
                    else {
                        param.output1.output = true;
                    }
                }

                return param;
            };`
        };

        this.scenarioList.list.push(scenario1);

        const scenario2: oegwThings.OegwScenario = {
            name: 'script2.js',
            scenario: `
            oegw.script.make = function (param) {

                param.output0.output = false;
                param.output1.output = false;

                var len = param.FaceRecognition.faces.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        param.output0.output = false;
                        param.output1.output = true;
                        if (param.FaceRecognition.faces[i].age < 18) {
                            param.output0.output = true;
                            param.output1.output = false;
                            break;
                        }
                    }
                }

                return param;
            };
            `
        };

        this.scenarioList.list.push(scenario2);

    }
/*
    private OnSendMessage(data: any): void {
        this.service.send(data);
    }
*/
/*
    private OnMsgReceived(msg: Msg) {

    }
    */
/* public getMType (msgStr: string): string {
        try {
            const mm: JsonMsg = JSON.parse(msgStr);

            return mm.mType.toString();
        }catch (e) {
            return 'not in message';
        }
    }

    public getStatus (msgStr: string): string {
        try {
            const mm: JsonMsg = JSON.parse(msgStr);

            return mm.data.status.toString();
        }catch (e) {
            return 'not in message';
        }
    }
*/
    /*
    * Converts JSON to string.
    */
   /*
    public msgString (json: any): string {
        return JSON.stringify( json, null, 2);
    }
*/
    /*
    *
    * This sends message to gateway.
    */
   /*
    public sendMessage(msg: string) {

        try {
            const mm: JsonMsg = JSON.parse(msg);

            try {
                this.service.send(msg);

                const m = new Msg();
                m.req = msg;
                this.msgArray.push(m);
            }catch (e) {
                const m = new Msg();
                m.req = 'Error with sending, not sent: ' + msg;
                m.resp = 'Error does not exists';
                this.msgArray.push(m);
            }
        } catch (e) {
            const m = new Msg();
            m.req = 'Error with parsing, not sent: ' + msg;
            m.resp = 'Error does not exists';
            this.msgArray.push(m);
        }
     }
*/
    /*
    *
    * This recieves message from gateway.
    */
   /*
    public receivedMessage(msg: any) {

        let msgStr = '';
        // const m = new Msg();
        try {
            const mm = JSON.parse(msg.data);
            msgStr = msg.data;

            this.parseIncomingMsg(mm);

        }catch (e) {
            msgStr = '' + msg.data;
        }

        if (this.msgArray.length > 0) {
            const lastResp = this.msgArray[this.msgArray.length - 1].resp;
             // window.alert('resp:' + lastResp);
            if (lastResp === undefined) {
                this.msgArray[this.msgArray.length - 1].resp = msgStr;
            } else {
                const m = new Msg();
                m.resp = msgStr;
                this.msgArray.push(m);
            }
        } else {
                const m = new Msg();
                m.resp = msgStr;
                this.msgArray.push(m);
        }
    }
*/
    private parseIncomingMsg (json: any) {
        if (json.mType === 'iqrfEmbedLedg_Get') {
            // const msg = json as iqrfApi.IqrfEmbedLedgGetResponse100;

            if (json.data.rsp.nAdr === 0) {
                this.coordinator.setData(json);
            }
        }
    }
}
