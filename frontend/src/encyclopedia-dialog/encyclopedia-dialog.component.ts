import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ApiService} from "../services/plant-api.service";

@Component({
  selector: 'app-encyclopedia-dialog',
  templateUrl: './encyclopedia-dialog.component.html',
  styleUrls: ['./encyclopedia-dialog.component.scss']
})
export class EncyclopediaDialogComponent implements OnInit {

  loading = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) {
  }

  plant: any | undefined;

  ngOnInit() {
    this.apiService.getPlantFromAPIById(this.data.plantId).subscribe((detailInfo: any) => {
      this.plant = detailInfo;
    });
  }

  onLoad(event: Event): void {
    this.loading = false;
    (event.target as HTMLImageElement).classList.add('loaded');
  }

}
