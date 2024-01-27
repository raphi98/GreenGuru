import { Component, Input, OnInit } from '@angular/core';
import { Plant } from '../models/plant';

@Component({
  selector: 'app-plant-card',
  templateUrl: './plant-card.component.html',
  styleUrls: ['./plant-card.component.scss']
})
export class PlantCardComponent implements OnInit {
  @Input() plant!: Plant;
  imageLoaded: boolean = false;
  hovering: boolean = false;

  onMouseEnter(): void {
    this.hovering = true;
  }

  onMouseLeave(): void {
    this.hovering = false;
  }
  onLoad(event: Event): void {
    this.imageLoaded = true;
    (event.target as HTMLImageElement).classList.add('loaded');
  }

  ngOnInit(): void {
    // Component initialization logic if necessary
    if(this.plant.fertilizing === null) {
      this.plant.fertilizing = 0;
    }
    if(this.plant.watering === null) {
      this.plant.watering = 0;
    }
  }
}
