import { Injectable, EventEmitter } from '@angular/core';
import { PointMachine, Trajectory, IFileList, ServerStatus } from './cobalt.model';

@Injectable()
export class ConfigService {
    public wsserver = 'ws://localhost:1338';
    public wsprotocol = 'cobalt';
    constructor() {
    }
}

@Injectable()
export class CobaltService {

    public bbb = false;

    private connection: WebSocket = null;
    public emitor$: EventEmitter<PointMachine> = new EventEmitter();
    public emitorTr$: EventEmitter<Trajectory> = new EventEmitter();
    public emitorFileList$: EventEmitter<IFileList> = new EventEmitter();
    public emitorFilesJson$: EventEmitter<IFileList> = new EventEmitter();
    public emitorlearnTraj$: EventEmitter<Trajectory> = new EventEmitter();
    public emitorPointInit$: EventEmitter<PointMachine> = new EventEmitter();
    public emitorPointLearn$: EventEmitter<PointMachine> = new EventEmitter();
    public bbTraj$: EventEmitter<boolean> = new EventEmitter();
    public bbTraj2$: EventEmitter<boolean> = new EventEmitter();
    public emitorlearnTraj2$: EventEmitter<Trajectory> = new EventEmitter();
    public emitorPointInit2$: EventEmitter<PointMachine> = new EventEmitter();
    public emitorMachineStatus$: EventEmitter<ServerStatus> = new EventEmitter();
    public emitorOnlineStatus$: EventEmitter<boolean> = new EventEmitter();
    public emitorTrajManX$: EventEmitter<Trajectory> = new EventEmitter();
    public emitorTrajManY$: EventEmitter<Trajectory> = new EventEmitter();
    public emitorTrajManZ$: EventEmitter<Trajectory> = new EventEmitter();

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
        };

        this.connection.onerror = (evnt: any) => {
            self.emitorOnlineStatus$.emit(false);
        };

        this.connection.onmessage = (message: any) => {
            try {
                const json = JSON.parse(message.data);

                if (json.type) {
                    if (json.type === 'trajectory') {
                        self.emitorTr$.emit(json.data as Trajectory);
                        self.bbTraj$.emit(true);

                    } else if (json.type === 'filelist') {
                        self.emitorFileList$.emit(json.data as IFileList);

                    } else if (json.type === 'filelistJson') {
                        self.emitorFilesJson$.emit(json.data as IFileList);

                    } else if (json.type === 'learnTrajectory') {
                        self.emitorlearnTraj$.emit(json.data as Trajectory);
                        self.emitorlearnTraj2$.emit(json.data as Trajectory);
                        self.bbTraj2$.emit(true);

                    } else if (json.type === 'manualTrajX') {
                        self.emitorTrajManX$.emit(json.data as Trajectory);

                    } else if (json.type === 'manualTrajY') {
                        self.emitorTrajManY$.emit(json.data as Trajectory);

                    } else if (json.type === 'manualTrajZ') {
                        self.emitorTrajManZ$.emit(json.data as Trajectory);

                    } else if (json.type === 'initData') {
                        self.emitorPointInit$.emit(json.data as PointMachine);
                        self.emitorPointInit2$.emit(json.data as PointMachine);

                    } else if (json.type === 'learnPosition') {
                        self.emitorPointLearn$.emit(json.data as PointMachine);

                    } else if (json.type === 'cncPosition') {
                        self.emitor$.emit(json.data as PointMachine);

                    } else if (json.type === 'getMachineStatus') {
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
