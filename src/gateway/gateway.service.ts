import { Injectable, EventEmitter } from '@angular/core';
import { ServerStatus } from './gateway.model';

@Injectable()
export class ConfigService {
    public wsserver = 'ws://127.0.0.1:1338';
    public wsprotocol = 'iqrf';
    constructor() {
    }
}

@Injectable()
export class GatewayService {

    public bbb = false;

    private connection: WebSocket = null;
    public emitorMachineStatus$: EventEmitter<ServerStatus> = new EventEmitter();
    public emitorOnlineStatus$: EventEmitter<boolean> = new EventEmitter();

    constructor(protected config: ConfigService) {
        this.open();
    }

    send(data: any): void {
        this.connection.send(data);
    }

    open(): boolean {

        if (this.connection == null) {
            this.connection = new WebSocket(this.config.wsserver,
                this.config.wsprotocol);
        }

        const self = this;

        this.connection.onopen = (evnt: any) => {
            self.emitorOnlineStatus$.emit(true);
        };

        this.connection.onerror = (evnt: any) => {
            self.emitorOnlineStatus$.emit(false);
            // window.alert('Error');
        };

        this.connection.onmessage = (message: any) => {

            window.alert('msg');
            try {
                const json = JSON.parse(message.data);

                if (json.type) {
                    if (json.type === 'getMachineStatus') {
                        self.emitorMachineStatus$.emit(json.data as ServerStatus);

                    }
                } else {
                    // self.emitor$.emit(json.data as PointMachine);
                   // window.alert(message.data);
                }
            } catch (e) {
                console.log('This doesn\'t look like a valid JSON: ',
                    message.data);
                return;
            }

            self.emitorOnlineStatus$.emit(true);

        };

        return true;
    }
}
