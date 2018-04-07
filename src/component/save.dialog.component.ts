import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

/*
* Orientation of end grab.
*/

@Component({
  templateUrl: 'save.dialog.component.html',
  styleUrls: ['save.dialog.component.css']
})

export class SaveDialogComponent implements OnInit {

  form: FormGroup;
  title: string;
  Ok: string;
  Cancel: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {

    this.form = this.formBuilder.group({
      filename: this.data.filename
    });

    this.title = this.data.title;
    this.Ok = this.data.Ok;
    this.Cancel = this.data.Cancel;
  }

  submit(form) {

    const list: any[] = [
      this.form.controls['filename'].value
    ];

    this.dialogRef.close(list);
  }
}
