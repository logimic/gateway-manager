import { Component } from '@angular/core';
import { CobaltModel, PointMachine, Point, WorkPoint, WorkPointArr, Trajectory } from '../cobalt/cobalt.model';
import { CobaltService } from '../cobalt/cobalt.service';

import { VERSION, MatDialog, MatDialogRef } from '@angular/material';
import { WorkpointDialogComponent } from './workpoint.dialog.component';
import { ConfirmDialogComponent } from './confirm.dialog.component';
import { filter } from 'rxjs/operators';

enum Commands {
    AddWorkPoint = 'addWP',
    EditWorkPoint = 'editWP',
    DeleteWorkPoint = 'deleteWP',
    RobotToWorkPoint = 'robotToWP'
}

@Component({
    selector: 'app-cobalt-learning-plist',
    templateUrl: './cobalt.learning.plist.html',
    styleUrls: ['./cobalt.learning.plist.css']
})
export class CobaltLearningPlistComponent {

    version = VERSION;

    workpointDialogRef: MatDialogRef<WorkpointDialogComponent>;
    confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

    files = [
        { name: 'foo.js', content: ''},
        { name: 'bar.js', content: ''}
      ];

    // TODO: this is temporary array - will be changed

    points: WorkPoint[] = [
        {x: 60, y: 20, z: 6, angles: {alpha: 16, beta: 16, gamma: 16}, r: 0},
        {x: -30, y: 120.66, z: 12, angles: {alpha: 17, beta: 17, gamma: 17}, r: 0}
   ];

   public pointInit: PointMachine = {
        p: {x: 1200, y: 200, z: 1459, angles: {alpha: 0, beta: 0, gamma: 0}},
        a: {f1: 0.19527308, f2: 0.39675211, f3: -0.47901035, f4: -1.17707612, f5: 0.21168781, f6: 1.16901459}
    };

    // Robot learning trajectory
    public learnTrajectory: Trajectory = null;

  // selectedOptions: number[]; // Order numbers of selected points.
   selectedLenght = 0;
   sel = new Array<number>();
   alist: any = null;

    constructor(protected service: CobaltService, protected model: CobaltModel, private dialog: MatDialog) {

        service.emitorlearnTraj2$.subscribe( w => {
            this.learnTrajectory = w;
            this.points = this.learnTrajectory.wpoints;
            this.alist = null;

        });

        service.emitorPointInit2$.subscribe( w => {
            this.pointInit = w;
        });

    }

    ngOnInit() {

    }

    OnSendMessage(data: any): void {
        this.service.send(data);
    }

    OnReloadLearnTraj(): void {
        const msg = {
            data: {
              command: 'learnTrajectory'
            }
          };
          this.OnSendMessage(JSON.stringify(msg));
    }

    OnSetRobotToPoint(order: number): void {
        const msg = {
            data: {
              command: Commands.RobotToWorkPoint,
              order: order
            }
        };

        this.OnSendMessage(JSON.stringify(msg));

        const msg2 = {
            data: {
              command: 'learn/getPosition'
            }
        };

        this.OnSendMessage(JSON.stringify(msg2));
    }

    OnSelected(list): void {
        this.alist = list;
        const selectedOptions = list.selectedOptions.selected.map(item => item.value);

        this.sel.length = 0;

        for (const it of selectedOptions) {
            this.sel.push(it);
        }


        this.selectedLenght = this.sel.length; // this.selectedOptions.length;

        // Set robot to selected point...
        if (this.sel.length > 0) {

            this.OnSetRobotToPoint(Number(this.sel[this.sel.length - 1]));
        }
    }

    OnBtnAdd(): void {

        // TODO: should be init point
        let pt: WorkPoint = {x: this.pointInit.p.x, y: this.pointInit.p.y, z: this.pointInit.p.z,
            angles: {alpha: this.pointInit.p.angles.alpha, beta: this.pointInit.p.angles.beta, gamma: this.pointInit.p.angles.gamma},
            r: 0};

        if (this.points.length > 0) {
            // Use coordinates from last point....
            pt = this.points[this.points.length - 1];
        }

        this.openWorkpointDialog(Commands.AddWorkPoint, 'Add Work Point', 'Add', 'Cancel', pt);
    }

    OnBtnEdit(): void {
        if (this.selectedLenght === 1) {
            // Edit just one point...
            this.openWorkpointDialog(Commands.EditWorkPoint, 'Edit Work Point', 'Update', 'Cancel', this.points[this.sel[0]]);
        }
    }

    OnBtnDelete(): void {
        let title = 'Delete Work Point?';
        let text = 'Really delete selected point?';

        if (this.selectedLenght > 1) {
            title = 'Delete Work Points?';
            text = 'Really delete selected points?';
        } else if (this.selectedLenght === 1) {
            text = 'Really delete selected point: WP' + this.sel[0]
            + ': ' + this.points[this.sel[0]].x
            + ', ' + this.points[this.sel[0]].y
            + ', ' + this.points[this.sel[0]].z
            + '?';
        }

        this.openConfirmDialog(title, text);
    }

    openWorkpointDialog(cmd, title, Ok, Cancel, pt: WorkPoint): void {

        this.workpointDialogRef = this.dialog.open(WorkpointDialogComponent, {
            width: '700px',
            height: '300px',
            data: {
                cmd: cmd,
                title: title,
                Ok: Ok,
                Cancel: Cancel,
                xCoord: pt.x, yCoord: pt.y, zCoord: pt.z,
                aCoord: pt.angles.alpha, bCoord: pt.angles.beta, cCoord: pt.angles.gamma
            }
        });

        this.workpointDialogRef.afterClosed().subscribe(result => {

            if (result.length > 0) {

                const pto: WorkPoint = {
                    x: Number(result[1]), y: Number(result[2]), z: Number(result[3]),
                        angles: {alpha: Number(result[4]), beta: Number(result[5]), gamma: Number(result[6])},
                    // P: {x: Number(result[1]), y: Number(result[2]), z: Number(result[3])},
                    // A: {x: Number(result[4]), y: Number(result[5]), z: Number(result[6])},
                    r: 0
                    };

                // Commands to server...
                if (result[0] === Commands.AddWorkPoint) {

                    const data = {
                        command: Commands.AddWorkPoint,
                        point: pto
                    };

                    const msg = {
                        data: data
                    };

                    // window.alert(JSON.stringify(msg));

                    this.OnSendMessage(JSON.stringify(msg));

                } else if (result[0] === Commands.EditWorkPoint  && this.sel.length > 0) {

                    const data = {
                        command: Commands.EditWorkPoint,
                        order: Number(this.sel[0]),
                        point: pto
                    };

                    const msg = {
                        data: data
                    };

                    this.OnSendMessage(JSON.stringify(msg));

                    this.OnSetRobotToPoint(this.sel[0]);
                }

                this.OnReloadLearnTraj();

                if (this.alist != null) {
                    this.alist.deselectAll();
                }
                this.sel.length = 0;
                this.selectedLenght = 0;

            }
        });
    }

    openConfirmDialog(title, text): void {
        this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            height: '160px',
            data: {
                title: title,
                text: text
            }
        });

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result && this.selectedLenght > 0) { // Delete selected points...

                const ptIndexes = Array<number>();

                // Put point to array for JSONinng
                for (const item of this.sel) {
                    ptIndexes.push(item);
                }

                const data = {
                    command: Commands.DeleteWorkPoint,
                    orders: ptIndexes
                };

                const msg = {
                    data: data
                };

                const jsonString = JSON.stringify(msg);

                this.OnSendMessage(JSON.stringify(msg));

                this.OnReloadLearnTraj();

                if (this.alist != null) {
                    this.alist.deselectAll();
                }
                this.sel.length = 0;
                this.selectedLenght = 0;

                // window.alert('JSON:' + jsonString);
            }
        });
      }
}
