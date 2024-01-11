import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-encyclopedia-dialog',
  templateUrl: './encyclopedia-dialog.component.html',
  styleUrls: ['./encyclopedia-dialog.component.scss']
})
export class EncyclopediaDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
