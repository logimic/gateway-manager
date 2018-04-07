import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

/*
* Orientation of end grab.
*/

@Component({
  templateUrl: 'endgrab.dialog.component.html',
  styleUrls: ['endgrab.dialog.component.css']
})

export class EndgrabDialogComponent implements OnInit {

  form: FormGroup;
  title: string;
  Ok: string;
  Cancel: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EndgrabDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      alpha: this.data.alpha,
      beta: this.data.beta,
      gamma: this.data.gamma
    });

    this.title = this.data.title;
    this.Ok = this.data.Ok;
    this.Cancel = this.data.Cancel;
  }

  submit(form) {

    const list: any[] = [
      this.form.controls['alpha'].value,
      this.form.controls['beta'].value,
      this.form.controls['gamma'].value
    ];

    this.dialogRef.close(list);
  }
}