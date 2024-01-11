import { Component, Input, OnInit } from '@angular/core';
import { Plant } from '../models/plant';

@Component({
  selector: 'app-plant-card',
  templateUrl: './plant-card.component.html',
  styleUrls: ['./plant-card.component.scss']
})
export class PlantCardComponent implements OnInit {
  @Input() plant!: Plant;

  ngOnInit(): void {
    // Component initialization logic if necessary
  }
}
