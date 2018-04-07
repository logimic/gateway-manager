import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'workpoint.dialog.component.html',
  styleUrls: ['workpoint.dialog.component.css']
})

export class WorkpointDialogComponent implements OnInit {

  form: FormGroup;
  cmd: string;
  title: string;
  Ok: string;
  Cancel: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<WorkpointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      xCoord: this.data.xCoord,
      yCoord: this.data.yCoord,
      zCoord: this.data.zCoord,
      aCoord: this.data.aCoord,
      bCoord: this.data.aCoord,
      cCoord: this.data.aCoord
    });

    this.cmd = this.data.cmd;
    this.title = this.data.title;
    this.Ok = this.data.Ok;
    this.Cancel = this.data.Cancel;

  }

  submit(form) {

    const list: any[] = [
      this.cmd,
      this.form.controls['xCoord'].value,
      this.form.controls['yCoord'].value,
      this.form.controls['zCoord'].value,
      this.form.controls['aCoord'].value,
      this.form.controls['bCoord'].value,
      this.form.controls['cCoord'].value
    ];

    this.dialogRef.close(list);
  }
}
