
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

    // Gateway Things...
    public coordinator: Coordinator = null;

    public scenarioList: oegwThings.OegwScenarioList = {
        list: [
            {name: '999',
            scenario: 'ssss'}
            ],
            activeScenario: ''
    };

    // oegw API
    public sc: oegwThings.OegwScenario = {
        name: ' ',
        scenario: ' '
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

        this.scenarioList.list.length = 0;

        this.coordinator =  new Coordinator(service);

        service.emitorOnlineStatus$.subscribe( w => {
            this.status.onlineStatus = w;
        });

        service.emitorMessage$.subscribe( w => {
            this.parseIncomingMsg(w);
        });

        service.emitorWsOegw$.subscribe( w => {
            this.cfg = w;
        });

        service.emitorScenario$.subscribe( w => {
            this.sc = w;
            this.scenarioList.list.push(this.sc);
        });

        // Set init state as control
        this.status.mode = 0;
        this.selCommDevice = 'Gateway';

        setTimeout(() => {
            this.ready = true;
        }, 500);

    }

    public isReady() {
        return this.ready;
    }

    private parseIncomingMsg (json: any) {
        if (json.mType === 'iqrfEmbedLedg_Get') {
            // const msg = json as iqrfApi.IqrfEmbedLedgGetResponse100;

            if (json.data.rsp.nAdr === 0) {
                this.coordinator.setData(json);
            }
        }
    }
}
