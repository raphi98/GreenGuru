import { Component } from '@angular/core';
import {ApiService} from "../services/plant-api.service";
import {MatDialog} from "@angular/material/dialog";
import {EncyclopediaDialogComponent} from "../encyclopedia-dialog/encyclopedia-dialog.component";

@Component({
  selector: 'app-encyclopedia-page',
  templateUrl: './encyclopedia-page.component.html',
  styleUrls: ['./encyclopedia-page.component.scss']
})
export class EncyclopediaPageComponent {

  plants: any[] | undefined;
  searchQuery: string = '';

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchPlants();
  }

  fetchPlants() {
    this.apiService.getPlantsFromAPI(this.searchQuery).subscribe((data: any) => {
      this.plants = data.data.filter((plant: { default_image: null; }) => plant.default_image !== null);
    });
  }

  search() {
    this.fetchPlants();
  }

}
