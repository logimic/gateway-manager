
import { Injectable, EventEmitter } from '@angular/core';
import { CobaltService } from './cobalt.service';
import { ISTLFacets, StlService } from '../webgl/stl.service';
// import { Observable } from 'rxjs/Observable'
import { Observable } from 'rxjs/Rx';

export interface AnglesOrient {
    alpha: number;
    beta: number;
    gamma: number;
}

export interface Point {
    x: number;
    y: number;
    z: number;
}

export interface PointOrient extends Point {
    angles: AnglesOrient;
}

export interface WorkPoint extends PointOrient {
    r: number;
}

export interface PointMachine {
    p: PointOrient;
    a: IF6;
}

export interface IF6 {
    f1: number;
    f2: number;
    f3: number;
    f4: number;
    f5: number;
    f6: number;
}

export interface Line {
    pt1: PointOrient;
    pt2: PointOrient;
}

export interface Arc {
    pt1: PointOrient;
    pt2: PointOrient;
    center: Point;
    normal: Point;
    radius: number;
}

export interface TrajectorySegment {
    reachable: boolean;
    geomType: number; // 1- line, 2- arc
    line: Line;
    arc: Arc;
}

export interface PointMachineRecord {
    point: PointMachine;
    time: number;
}

export interface Trajectory {
    changeFlag: boolean; // GUI local flag...
    reachable: boolean;
    segments: TrajectorySegment[];
    wpoints: WorkPoint[];
}

export interface WorkPointArr {
    pts: WorkPoint[];
}

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

export interface IFileList {
    files: string[];
}

/* hold information transmitted by websocket*/
@Injectable()
export class CobaltModel  {

    readonly MAX_RECORDS: number = 10000;
    readonly DW_RECORDS: number = 5000;

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

    // Recorded CNC positions...
    public records: PointMachineRecord[];

    // Position set by slider...
    protected position = 0;

    // Robot control trajectory
    public trajectory: Trajectory = null;

    // Robot learning trajectory
    public learnTrajectory: Trajectory = null;

    // Robot manual trajectories
    public trajManX: Trajectory = null;
    public trajManY: Trajectory = null;
    public trajManZ: Trajectory = null;

    // Control Trajectory loaded...
    public trajChanged = false;  // true: newly loaded/changed
    public learnTrajChanged = false;  // true: newly loaded/changed

    // Initial point
    // This point is hardcoded, but can be modified by command.
    public pointInit: PointMachine = {
        p: {x: 1200, y: 200, z: 1459, angles: {alpha: 0, beta: 0, gamma: 0}},
        a: {f1: 0.19527308, f2: 0.39675211, f3: -0.47901035, f4: -1.17707612, f5: 0.21168781, f6: 1.16901459}
     };

    // Learning model position
    public learnPos: PointMachine = this.pointInit;

    public filelist: IFileList = {
        files: [ 'none..']
    };

    public filelistJson: IFileList = {
        files: [ 'none JSON..']
    };

    public facets: ISTLFacets[];

    // Loading 3D model data
    public loading = true;

    public origins: Point[] = [
         {x:   0, y:   0, z:    0},   // h0
         {x:   0, y:   0, z:  719},   // h1
         {x: 300, y:   0, z:    0},   // h2
         {x:   0, y:   0, z:  600},   // h3
         {x:   0, y:   -12, z:  140},   // h4
         {x: 573, y:  0, z:    0},   // h5
         {x: 127, y:   0, z:    0},   // h6
         {x:   0, y:   0, z:    0},   // h7
    ];

    public bones: Point[] = [

        {x:   0, y:   0, z:    0},   // h0
        {x:   0, y:   0, z:    0},

        {x:   0, y:   0, z:    0},   // h1
        {x:   0, y:   0, z:  300},

        {x:   0, y:   0, z:    0},   // h2
        {x:   0, y:   250, z:  0},

        {x:   0, y:   0, z:  0},    // h3
        {x:   0, y:   200, z: 0},

        {x:   0, y:   0, z:  0},   // h4
        {x:   200, y:   0, z:  0},

        {x:   0, y:  0, z:    0},   // h5
        {x:   0, y:  100, z:    0},

        {x: 0, y:   0, z:    0}, // h6
        {x: 300, y:   0, z:    0},

        {x: 0, y:   0, z:    0}, // h7
        {x: 50, y:   0, z:    0}
    ];

    constructor ( protected service: CobaltService,
        protected stl: StlService) {

        this.records = new Array();

        // Register
        service.emitor$.subscribe(
            w => {
                this.store(w);
            });

        service.emitorTr$.subscribe( w => {
            this.trajectory = w;
            this.check();
        });

        service.emitorFileList$.subscribe( w => {
            this.filelist = w;
            this.check();
        });

        service.emitorFilesJson$.subscribe( w => {
            this.filelistJson = w;
            this.check();
        });

        service.emitorlearnTraj$.subscribe( w => {
            this.learnTrajectory = w;
            this.check();
        });

        service.emitorPointInit$.subscribe( w => {
            this.pointInit = w;
            this.check();
        });

        service.emitorPointLearn$.subscribe( w => {
            this.learnPos = w;
            this.check();
        });

        service.bbTraj$.subscribe( w => {
            this.trajChanged = w;
            this.check();
            this.trajChangedMethod();
        });

        service.bbTraj2$.subscribe( w => {
            this.learnTrajChanged = w;
        });

        service.emitorMachineStatus$.subscribe( w => {
            this.status.serverStatus = w;
        });

        service.emitorOnlineStatus$.subscribe( w => {
            this.status.onlineStatus = w;
        });

        service.emitorTrajManX$.subscribe( w => {
            this.trajManX = w;
            this.trajManX.changeFlag = true;
        });

        service.emitorTrajManY$.subscribe( w => {
            this.trajManY = w;
            this.trajManY.changeFlag = true;
        });

        service.emitorTrajManZ$.subscribe( w => {
            this.trajManZ = w;
            this.trajManZ.changeFlag = true;
        });

        this.loading = true;

        this.facets = [null, null, null, null, null, null];

        Observable.merge<ISTLFacets>(
            stl.get(`1`),
            stl.get(`2`),
            stl.get(`3`),
            stl.get(`4`),
            stl.get(`5`),
            stl.get(`6`))
            .map((d, i) => {
                let index = + d.name;
                index = index - 1;
                this.facets[index] = d;
        }).subscribe(o => {
            this.check();
        });

        // Set init state as control
        this.status.mode = 0;

        setTimeout(() => {
            // Get list of G-code files...
            this.OnGetFilelist();

            // Get initial position
            this.OnGetInitData();

             // Load trajectory...
            this.OnGetControlTrajectory();
        }, 1500);

    }

    protected check() {
        if (this.loading) {
            this.loading = (
              //  this.trajectory == null ||
                this.facets[0] == null ||
                this.facets[1] == null ||
                this.facets[2] == null ||
                this.facets[3] == null ||
                this.facets[4] == null ||
                this.facets[5] == null
            );
        }
    }

    private OnSendMessage(data: any): void {
        this.service.send(data);
    }

    public OnGetFilelist (): void {
        const msg = {
            data: {
                command: 'cnc/getFiles'
            }
        };

        this.OnSendMessage(JSON.stringify(msg));
    }

    public OnGetControlTrajectory (): void {
        const msg = {
            data: {
              command: 'trajectory'
            }
          };

        this.OnSendMessage(JSON.stringify(msg));
    }

    public OnGetInitData (): void {
        const msg = {
            data: {
              command: 'getInitData'
            }
          };

        this.OnSendMessage(JSON.stringify(msg));
    }

    public isReady(): boolean {
        return !this.loading;
    }

    protected composition(): void {
        if (this.records.length > this.MAX_RECORDS) {
            this.records = this.records.splice(0, this.MAX_RECORDS - this.DW_RECORDS);
        }
    }

    protected trajChangedMethod(): void {
       // window.alert('***');

       this.status.trajReachable = this.trajectory.reachable;
       this.status.message = 'Error: Trajecotry has unreachable parts!';

       if (this.trajectory.segments.length > 0) {
           this.status.trajReady = true;
       } else {
           this.status.trajReady = false;
       }

    }

    protected store(d: PointMachine): void {
        const t: number = Date.now();

        if (this.records.length > 0) {
          //  if (d !== this.records[this.records.length - 1].data) {
            if (!this.isEqual(this.records[this.records.length - 1].point, d)) {
                this.composition();
                this.records[this.records.length] = {time: t, point: d};
                this.position = 0;
            } else {
              //  window.alert('a');
            }
        } else {
            this.composition();
            this.records[this.records.length] = {time: t, point: d};
            this.position = 0;
        }

    }

    public isEqual(a: PointMachine, b: PointMachine): boolean {

        if (a.p.x === b.p.x && a.p.y === b.p.y && a.p.z === b.p.z
         && a.p.angles.alpha === b.p.angles.alpha && a.p.angles.beta === b.p.angles.beta && a.p.angles.gamma === b.p.angles.gamma) {
            return true;
        }

        return false;
    }

    public last(): PointMachine {

       // if (this.recording) {
            return (this.records.length > 0) ? this.records[this.records.length - 1].point : null;
       // } else {
       //     return (this.records.length > this.position) ? this.records[this.position].data : null;
      //  }
    }

    public getCobaltData () {

    }

    public nlast(n: number): PointMachine[] {

     //   if (this.recording) {

      //  if (this.records.length > n) {

            const ret = [];

            if (this.records.length <= 0) {
                ret.push(this.pointInit);
            }

            let pos = 0; // this.records.length - n;

            if (this.records.length > n) {
                pos = this.records.length - n;
            }

        //    if (pos > 0) {

                for (; pos < this.records.length; pos++) {
                    ret.push(this.records[pos].point);
                }

         //   }

            return ret.reverse();
       // }
            /*
        } else {

            const ret = [];

            let pos = this.position - n;

            if (pos < 0) {
                n = n + pos;
                pos = 0;
            }

            for (; pos < this.position; pos++) {
                ret.push(this.records[pos].data);
            }

            return ret.reverse();
        }
*/
        // return [];
    }

    public bone(index: number): Point[] {
        return [this.bones[2 * index], this.bones[2 * index + 1]];
    }

    public origin(index: number): Point {
        const r: Point = {x: 0, y: 0, z: 0};

        for (let i = 0; i <= index; i++) {
             r.x += this.origins[i].x;
             r.y += this.origins[i].y;
             r.z += this.origins[i].z;
        }

        return r;
    }

    public mesh(index: number): ISTLFacets {
        return this.facets[index];
    }

    public goto(position: number) {
        if (position < this.records.length) {
            this.position = position;
           // this.replay = this.records[this.position].time;
           // window.alert('Pos:' + this.position);
        }
    }

    public getRecordCount(): number {
        return this.records.length;
    }

    public getRecordIndex(): number {
        return this.position;
    }

    public gotoLeft(): void {
        this.goto(this.getRecordIndex() - 1);

    }

    public gotoRight(): void {

        this.goto(this.getRecordIndex() + 1);
    }

    public origin2(index: number): Point {
        const r: Point = {x: 0, y: 0, z: 0};

        for (let i = 0; i <= index; i++) {
             r.x += this.origins[i].x;
             r.y += this.origins[i].y;
             r.z += this.origins[i].z;
        }

        return r;
    }

    /*
     * Returns perpendicular vector 'c' to a plane defined by two vectors 'a' and 'b'
     */
    public vectorMultiplication (a: Point, b: Point): Point {
        const c: Point = {x: 0, y: 0, z: 0};

        c.x = (a.y * b.z) - (a.z * b.y);
        c.y = (a.z * b.x) - (a.x * b.z);
        c.z = (a.x * b.y) - (a.y * b.x);

        return c;
    }

    /*
     *  Returns vector lenght.
     */
    public getVectorLenght (vector: Point): number {
        return Math.sqrt((vector.x * vector.x) + (vector.y * vector.y) + (vector.z * vector.z));
    }

    public getVectorAngle(v1: Point, v2: Point): number {
        let angle = 0;
        const df = 1E-8;

        if (this.getVectorLenght(v1) <= 1E-8 || this.getVectorLenght(v2) <= 1E-8) {
            return 0;
        }

        const a = ((v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z)) / (this.getVectorLenght(v1) * this.getVectorLenght(v2));

        if ((a >= 1 - df) && (a <= 1 + df)) {angle = 0; }
        if ((a >= -1 - df) && (a <= -1 + df)) {angle = Math.PI; }
        if (a > -1 + df && (a < 1 - df)) {angle = Math.acos(a); }

        return angle;
    }

    /*
     * Transforms 'p' point from local to global coordinate system and vice versa.
     *
     */
    public transformPoint_UCStoWCS (p: Point, p0: Point, v1: Point, v2: Point, v3: Point, dir: number): Point {
        // p0    center of UCS [absolute]
        // v1, axis X of UCS  [vector]
        // v2, axis Y of UCS  [vector]
        // v3 axis Z of UCS  [vector]
        // these vectors have to be parpendicular !!!!!!

        // x, y, z - absolute coordinate

        // dir -  1-to WCS  2- to UCS  0- return

        const pv: Point = {x: 0, y: 0, z: 0};

        // UCE vecto lenghts
        const d1 = this.getVectorLenght(v1);
        const d2 = this.getVectorLenght(v2);
        const d3 = this.getVectorLenght(v3);

        // WCS vectors
        const w1: Point = {x: 0, y: 0, z: 0};
        const w2: Point = {x: 0, y: 0, z: 0};
        const w3: Point = {x: 0, y: 0, z: 0};

        w1.x = 1; w1.y = 0; w1.z = 0;
        w2.x = 0; w2.y = 1; w2.z = 0;
        w3.x = 0; w3.y = 0; w3.z = 1;

        const dw1 = this.getVectorLenght(w1);
        const dw2 = this.getVectorLenght(w2);
        const dw3 = this.getVectorLenght(w3);

        // delky vektoru WCS

        const fi1 = ((v1.x * w1.x) + (v1.y * w1.y) + (v1.z * w1.z)) / (d1 * dw1);
        const fi2 = ((v2.x * w1.x) + (v2.y * w1.y) + (v2.z * w1.z)) / (d2 * dw1);
        const fi3 = ((v3.x * w1.x) + (v3.y * w1.y) + (v3.z * w1.z)) / (d3 * dw1);

        const ni1 = ((v1.x * w2.x) + (v1.y * w2.y) + (v1.z * w2.z)) / (d1 * dw2);
        const ni2 = ((v2.x * w2.x) + (v2.y * w2.y) + (v2.z * w2.z)) / (d2 * dw2);
        const ni3 = ((v3.x * w2.x) + (v3.y * w2.y) + (v3.z * w2.z)) / (d3 * dw2);

        const li1 = ((v1.x * w3.x) + (v1.y * w3.y) + (v1.z * w3.z)) / (d1 * dw3);
        const li2 = ((v2.x * w3.x) + (v2.y * w3.y) + (v2.z * w3.z)) / (d2 * dw3);
        const li3 = ((v3.x * w3.x) + (v3.y * w3.y) + (v3.z * w3.z)) / (d3 * dw3);

        // from UCS to WCS
        if (dir === 1) {
            pv.x = (p.x * fi1) + (p.y * fi2) + (p.z * fi3);
            pv.y = (p.x * ni1) + (p.y * ni2) + (p.z * ni3);
            pv.z = (p.x * li1) + (p.y * li2) + (p.z * li3);

            pv.x = pv.x + p0.x;
            pv.y = pv.y + p0.y;
            pv.z = pv.z + p0.z;
        }

        // from WCS to UCS
        if (dir === 2) {
            const pp: Point = {x: 0, y: 0, z: 0};

            pp.x = p.x - p0.x;
            pp.y = p.y - p0.y;
            pp.z = p.z - p0.z;

            pv.x = (pp.x * fi1) + (pp.y * ni1) + (pp.z * li1);
            pv.y = (pp.x * fi2) + (pp.y * ni2) + (pp.z * li2);
            pv.z = (pp.x * fi3) + (pp.y * ni3) + (pp.z * li3);
        }

        return pv;
    }

    /*
     * Returns Arc array.  C3 means n=[0,0,1] and C2 means n=[0,0,-1].
     */
    public getArcP1P2R(p1: Point, p2: Point, n: Point, radius: number, nPoints: number): Point[] {

        const vu: Point = {x: 0, y: 0, z: 0};
        let nn: Point = {x: 0, y: 0, z: 0};
        let nnn: Point = {x: 0, y: 0, z: 0};

        vu.x = p2.x - p1.x;
        vu.y = p2.y - p1.y;
        vu.z = p2.z - p1.z;

        nn = this.vectorMultiplication (n, vu);

        nnn = this.vectorMultiplication (vu, nn);

        const ct: Point = {x: 0, y: 0, z: 0};
        ct.x = this.getVectorLenght(vu) / 2.0;
        ct.y = 0;
        ct.z = 0;

        if (Math.sqrt(radius * radius) <= Math.sqrt(ct.x * ct.x)) {
            ct.y = 0;
        } else {
            ct.y = Math.sqrt((radius * radius) - (ct.x * ct.x));
        }

        const center = this.transformPoint_UCStoWCS(ct, p1, vu, nn, nnn, 1);

        // Now calculate array

        const p1c: Point = {x: 0, y: 0, z: 0};
        const p2c: Point = {x: 0, y: 0, z: 0};

        p1c.x = p1.x - center.x;
        p1c.y = p1.y - center.y;
        p1c.z = p1.z - center.z;

        p2c.x = p2.x - center.x;
        p2c.y = p2.y - center.y;
        p2c.z = p2.z - center.z;

        const angle = this.getVectorAngle(p1c, p2c);

        if (angle <= 1E-8) {
            return [p1, p2];
        }

        // Local points
        let p1L: Point = {x: 0, y: 0, z: 0};
        let p2L: Point = {x: 0, y: 0, z: 0};

        const py = this.vectorMultiplication (nnn, p1c);

        p1L = this.transformPoint_UCStoWCS(p1, center, p1c, py, nnn, 2);
        p2L = this.transformPoint_UCStoWCS(p2, center, p1c, py, nnn, 2);

        // Now rotate
        const da = angle / nPoints;
        const r = this.getVectorLenght(p1c);

        const arrL = [];

        arrL.push(p1L);
        let dAngle = 0;

        for (let i = 1; i < nPoints; i++) {
            const item: Point = {x: 0, y: 0, z: 0};

            dAngle = dAngle + da;

            item.x = r * Math.cos(dAngle);
            item.y = r * Math.sin(dAngle);
            item.z = 0;

            arrL.push(item);
        }

        arrL.push(p2L);

        // Convert local array to global...
        const arrG = [];

        for (const item of arrL) {
            const itemG: Point =  this.transformPoint_UCStoWCS(item, center, p1c, py, nnn, 1);

            arrG.push(itemG);
        }

        return arrG;
    }

}
