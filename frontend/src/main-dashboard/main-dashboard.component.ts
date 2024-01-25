import { Component, OnInit } from '@angular/core';
import {map, Observable} from 'rxjs';
import { Plant } from '../models/plant';
import { PlantService } from '../services/plant.service';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  userId: number | null = null;
  plants$!: Observable<Plant[]>;
  totalPlants$!: Observable<number>;
  plantsNeedingWater$!: Observable<number>;
  plantsNeedingFertilizer$!: Observable<number>;

  constructor(private plantService: PlantService,
              private authService: AuthService) {}

  ngOnInit(): void {
    //get user ID from token
//get all plants for user ID
//get total plants
//get plants needing water
//get plants needing fertilizer
    this.userId = this.authService.getUserIdFromToken();
    if (!this.userId) {
      throw new Error('User ID not found in token');
    }
    this.plants$ = this.plantService.getAllPlantsForUser(this.userId);

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

