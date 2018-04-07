import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'confirm.dialog.component.html'
})

export class ConfirmDialogComponent implements OnInit {

  form: FormGroup;
  title: string;
  text: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {
    this.title = this.data.title;
    this.text = this.data.text;
  }
}
