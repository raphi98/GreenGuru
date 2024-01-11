import { Component, OnInit } from '@angular/core';
import {map, Observable} from 'rxjs';
import { Plant } from '../models/plant';
import { PlantService } from '../services/plant.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  plants$!: Observable<Plant[]>;
  totalPlants$!: Observable<number>;
  plantsNeedingWater$!: Observable<number>;
  plantsNeedingFertilizer$!: Observable<number>;

  constructor(private plantService: PlantService) {}

  ngOnInit(): void {
    this.plants$ = this.plantService.getAllPlants();

    this.totalPlants$ = this.plants$.pipe(
      map(plants => plants.length)
    );

    this.plantsNeedingWater$ = this.plants$.pipe(
      map(plants => plants.filter(plant => plant.watering === 0).length)
    );

    this.plantsNeedingFertilizer$ = this.plants$.pipe(
      map(plants => plants.filter(plant => plant.fertilizing !== 'never' && plant.fertilizing === 0).length)
    );
  }
}

