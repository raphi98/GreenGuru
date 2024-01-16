import {Component, Input} from '@angular/core';
import {ApiService} from "../services/plant-api.service";
import {MatDialog} from "@angular/material/dialog";
import {EncyclopediaDialogComponent} from "../encyclopedia-dialog/encyclopedia-dialog.component";


@Component({
  selector: 'app-encyclopedia-component',
  templateUrl: './encyclopedia-component.component.html',
  styleUrls: ['./encyclopedia-component.component.scss']
})
export class EncyclopediaComponentComponent {

  @Input() plant: any;

  constructor(private dialog: MatDialog) {
  }

  openDialog(plantId: number) {
    this.dialog.open(EncyclopediaDialogComponent, {
      data: {plantId}, height: '80%', width: '90%'
    });
  }

}
