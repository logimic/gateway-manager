import {Component} from '@angular/core';
import {VERSION, MatDialog, MatDialogRef} from '@angular/material';
import {FileNameDialogComponent} from './file.name.dialog.component'
import { filter } from 'rxjs/operators';
/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-cobalt-file-dialog',
  templateUrl: 'cobalt.file.dialog.html'
})
export class CobaltFileDialog {
  version = VERSION;

  fileNameDialogRef: MatDialogRef<FileNameDialogComponent>;

  constructor(private dialog: MatDialog) {}

  files = [
    { name: 'foo.js', content: ''},
    { name: 'bar.js', content: ''}
  ];
  
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
        const index = this.files.findIndex(f => f.name == file.name);
        if (index !== -1) {
          this.files[index] = { name, content: file.content }
        }
      } else {
        this.files.push({ name, content: ''});
      }
    });
  }
}
