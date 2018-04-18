import { Injectable, EventEmitter } from '@angular/core';
import { ServerStatus, ConfigWS } from './gateway.model';
import { Http } from '@angular/http';
/*
export interface JsonMsgData {
    msgId: string;
    timeout: number;
    status: number;
}

export interface JsonMsg {
    mType: string;
    data: JsonMsgData;
}
*/
export class Msg {
    req: string;
    resp: string;
}


@Injectable()
export class GatewayService {

    public bbb = false;
    private timerConnect;
    public cfg: ConfigWS = {
        wsServer: '',
        wsProtocol: '',
        valid: false
    };

    msgArray: Msg[];

    private connection: WebSocket = null;
    public emitorMachineStatus$: EventEmitter<ServerStatus> = new EventEmitter();
    public emitorOnlineStatus$: EventEmitter<boolean> = new EventEmitter();
    public emitorMessage2$: EventEmitter<String> = new EventEmitter();
    public emitorMessage$: EventEmitter<any> = new EventEmitter();
    public emitorCfg$: EventEmitter<ConfigWS> = new EventEmitter();

    constructor(protected http: Http) {

        this.msgArray = new Array();

        this.loadConfig();
        this.connectionTimer(2000);
    }

    loadConfig() {
        const path = './assets/cfg/serverConfig.json';
        this.http.get(path).subscribe(data => {
            // console.log('data', data.text());
            this.cfg.wsServer = data.json().wsServer;
            this.cfg.wsProtocol = data.json().wsProtocol;
            this.cfg.valid = true;

            this.emitorCfg$.emit(this.cfg);
        });
    }

    private connectionTimer(step: number) {
        // LOaded adresses
        if (this.cfg.valid) {

            if (this.connection == null) {
                this.open();

            } else {
                window.clearTimeout(this.timerConnect);
                return;
            }
        }

        window.clearTimeout(this.timerConnect);
        this.timerConnect = window.setTimeout(() => this.connectionTimer(step), step);
    }
/*
    send(data: any): void {
        this.connection.send(data);
    }
*/
    open(): boolean {

        if (this.connection == null) {
            this.connection = new WebSocket(this.cfg.wsServer,
                this.cfg.wsProtocol);
        }

        const self = this;

        this.connection.onopen = (evnt: any) => {
            self.emitorOnlineStatus$.emit(true);
        };

        this.connection.onerror = (evnt: any) => {
            self.emitorOnlineStatus$.emit(false);
        };

        this.connection.onclose = (evnt: any) => {
            self.emitorOnlineStatus$.emit(false);
            this.connection.close();
            this.connection = null;
            this.connectionTimer(2000);
        };

        this.connection.onmessage = (message: any) => {
            this.receivedMessage(message);
            /*
            try {
                self.emitorMessage3$.emit(message);

            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ',
                    message.data);

                window.alert('Invalid JSON data ERROR EXCEPTION: ' + message.data );
                return;
            }
            */
        };

        return true;
    }

    /*
    *
    * This sends message to gateway.
    */
   public sendMessage(msg: string) {
        try {
            const mm = JSON.parse(msg);

            try {
                this.connection.send(msg);

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
   /*
    *
    * This recieves message from gateway.
    */
   public receivedMessage(msg: any) {

        const self = this;
        let msgStr = '';

        try {
            const mm = JSON.parse(msg.data);
            msgStr = msg.data;

            self.emitorMessage$.emit(mm);

        }catch (e) {
            msgStr = '' + msg.data;
        }

        if (this.msgArray.length > 0) {
            const lastResp = this.msgArray[this.msgArray.length - 1].resp;

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

    public getMType (msgStr: string): string {
        let mType = '';
        try {
            const mm = JSON.parse(msgStr);

            mType = mm.mType.toString();
        }catch (e) {
            return 'not in message';
        }

        return mType;
    }

    public getStatus (msgStr: string): string {
        let status = '';
        try {
            const mm = JSON.parse(msgStr);

            status = mm.data.status.toString();
        }catch (e) {
            return 'not in message';
        }

        return status;
    }
}
