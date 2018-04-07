import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CobaltModel, PointMachine, Point } from '../cobalt/cobalt.model';
import { CobaltService } from '../cobalt/cobalt.service';
import { WebGlComponent } from '../webgl/webgl.component';


import {VERSION, MatDialog, MatDialogRef} from '@angular/material';
import {FileNameDialogComponent} from './file.name.dialog.component';
import { EndgrabDialogComponent } from './endgrab.dialog.component';
import { SaveDialogComponent } from './save.dialog.component';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-cobalt-switch-mode',
    templateUrl: 'cobalt.switch.mode.html',
    styleUrls: ['cobalt.switch.mode.css']
})
export class CobaltSwitchModeComponent {

  files = [
      { name: 'foo.js', content: ''},
      { name: 'bar.js', content: ''}
  ];

  version = VERSION;

  fileNameDialogRef: MatDialogRef<FileNameDialogComponent>;
  endgrabDialogRef: MatDialogRef<EndgrabDialogComponent>;
  saveDialogRef: MatDialogRef<SaveDialogComponent>;

  wait = false;

  constructor(protected service: CobaltService, protected model: CobaltModel, private dialog: MatDialog, private scene: WebGlComponent) {
  }

  OnSendMessage(data: any): void {
    this.service.send(data);
  }

  OnControlModeClick(selection): void {

    this.model.status.mode = selection.value;

    // Switch to learning mode.
    if (this.model.status.mode === 1) {

      const msg = {
        data: {
          command: 'learnTrajectory'
        }
      };
      this.OnSendMessage(JSON.stringify(msg));

      const msg2 = {
        data: {
          command: 'getInitData'
        }
      };

      this.OnSendMessage(JSON.stringify(msg2));

    } else if (this.model.status.mode === 0) { // Control mode

      // Refresh list of available cnc files
      this.model.OnGetFilelist();

      // Reload trajectory from server
      this.model.OnGetControlTrajectory();
    }
  }

  OnFileSelectClick(selection): void {

    this.model.status.cncFile = selection.value;

    const msg = {
      data: {
        command: 'cnc/open',
        file: this.model.status.cncFile
      }
    };

    this.OnSendMessage(JSON.stringify(msg));

    this.wait = true;

    setTimeout(() => {
      this.wait = false;

      const msgt = {
        data: {
          command: 'trajectory'
        }
      };

      this.OnSendMessage(JSON.stringify(msgt));
    }, 8000);
  }

  OnFileJsonSelectClick(selection): void {

    this.model.status.jsonFile = selection.value;

    window.alert('Selected JSON: ' + this.model.status.jsonFile);

    const msg = {
      data: {
        command: 'LoadFromJson',
        file: this.model.status.jsonFile
      }
    };

    this.OnSendMessage(JSON.stringify(msg));
  }

  OnSaveJson(): void {
    this.openSaveDialog('Save to JSON file...', 'OK', 'Cancel');
  }


  OnLearnigModeClick(e: any): void {


  }
/*
  openFileDialog(file?) {
    this.fileNameDialogRef = this.dialog.open(FileNameDialogComponent, {
      data: {
        filename: file ? file.name : ''
      }
    });

    this.fileNameDialogRef.afterClosed().pipe(
      filter(name => name)
    ).subscribe(name => {
      if (file) {
        const index = this.files.findIndex(f => f.name === file.name);
        if (index !== -1) {
          this.files[index] = { name, content: file.content };
        }
      } else {
        this.files.push({ name, content: ''});
      }
    });
  }
*/
  OnEndGrab(): void {
    this.openEndgrabDialog('Set Endgrab Orientation', 'OK', 'Cancel');
  }

  openEndgrabDialog(title, Ok, Cancel): void {

    this.endgrabDialogRef = this.dialog.open(EndgrabDialogComponent, {
        width: '700px',
        height: '250px',
        data: {
            title: title,
            Ok: Ok,
            Cancel: Cancel,
            alpha: 0,
            beta: 0,
            gamma: 0
        }
    });

    this.endgrabDialogRef.afterClosed().subscribe(result => {

        if (result.length > 0) {
          const msg = {
            data: {
              command: 'pincer',
              angles: [
                Number(result[0]),
                Number(result[1]),
                Number(result[2])
              ]
            }
          };

          this.OnSendMessage(JSON.stringify(msg));
        }
    });
  }

  openSaveDialog(title, Ok, Cancel): void {

    this.saveDialogRef = this.dialog.open(SaveDialogComponent, {
        width: '250px',
        height: '250px',
        data: {
            title: title,
            Ok: Ok,
            Cancel: Cancel,
            filename: 'myfile.json'
        }
    });

    this.saveDialogRef.afterClosed().subscribe(result => {

     // window.alert('Result:' + result[0]);

        if (result.length > 0) {
          const msg = {
            data: {
              command: 'SaveToJson',
              file: result[0]
            }
          };

          this.OnSendMessage(JSON.stringify(msg));
        }
    });
  }
}
