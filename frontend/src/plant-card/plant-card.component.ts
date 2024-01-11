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
  onLoad(event: Event): void {
    this.imageLoaded = true;
    (event.target as HTMLImageElement).classList.add('loaded');
  }

  ngOnInit(): void {
    // Component initialization logic if necessary
  }
}
