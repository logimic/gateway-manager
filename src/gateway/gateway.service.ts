import { Injectable, EventEmitter } from '@angular/core';
import { ServerStatus, JsonMsg, ConfigWS } from './gateway.model';
import { Http } from '@angular/http';


@Injectable()
export class GatewayService {

    public bbb = false;
    private timerConnect;
    public cfg: ConfigWS = {
        wsServer: '',
        wsProtocol: '',
        valid: false
    };

    private connection: WebSocket = null;
    public emitorMachineStatus$: EventEmitter<ServerStatus> = new EventEmitter();
    public emitorOnlineStatus$: EventEmitter<boolean> = new EventEmitter();
    // public emitorMessage$: EventEmitter<JsonMsg> = new EventEmitter();
    public emitorMessage2$: EventEmitter<String> = new EventEmitter();
    public emitorMessage$: EventEmitter<any> = new EventEmitter();
    public emitorCfg$: EventEmitter<ConfigWS> = new EventEmitter();

    constructor(protected http: Http) {
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

    send(data: any): void {
        this.connection.send(data);
    }

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
            // window.alert('Error');
        };

        this.connection.onclose = (evnt: any) => {
            self.emitorOnlineStatus$.emit(false);
            this.connection.close();
            this.connection = null;
            this.connectionTimer(2000);
        };

        this.connection.onmessage = (message: any) => {
            self.emitorMessage$.emit(message);
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
}
