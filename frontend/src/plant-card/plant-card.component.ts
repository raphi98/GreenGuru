import { Component, Input, OnInit } from '@angular/core';
import { Plant } from '../models/plant';
import { PlantService } from '../services/plant.service';
import { AuthService } from '../services/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-plant-card',
  templateUrl: './plant-card.component.html',
  styleUrls: ['./plant-card.component.scss']
})
export class PlantCardComponent implements OnInit {
  @Input() plant!: Plant;
  imageLoaded: boolean = false;
  hovering: boolean = false;
  userId: number | null = null;

  constructor(private plantService: PlantService,
              private authService: AuthService,
              private snackBar: MatSnackBar) { }

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

  onWaterClick(plantId: number): void {
    //get user ID from token using auth service
    this.userId = this.authService.getUserIdFromToken();
    this.plantService.waterPlant(plantId).subscribe({
      next: response => {
        // Handle the response
        this.playAnimation(plantId,'watering');
      },
      error: error => {
        // Handle any errors here
        console.log('Error watering plant', error)
      }
    });
    if (this.userId != null) {
      this.authService.addScore(this.userId, 1).subscribe({
        next: response => {
          // Handle the response
          console.log(response)
          this.snackBar.open('You earned 1 point for watering your plant', 'Okay',{
            duration: 2000,
          })
        },
        error: error => {
          // Handle any errors here
          console.log('Error adding score', error)
        }
      });
    }
    }

  onFertilizeClick(plantId: number): void {
    this.userId = this.authService.getUserIdFromToken();
    this.plantService.fertilizePlant(plantId).subscribe({
      next: response => {
        // Handle the response
        this.playAnimation(plantId,'fertilizing');
      },
      error: error => {
        // Handle any errors here
        console.log('Error fertilizing plant', error)
      }
    });
    if (this.userId != null) {
      this.authService.addScore(this.userId, 5).subscribe({
        next: response => {
          // Handle the response
          console.log(response)
          this.snackBar.open('You earned 5 points for fertilizing your plant', 'Okay',{
            duration: 2000,
          });
        },
        error: error => {
          // Handle any errors here
          console.log('Error adding score', error)
        }
      });
    }
  }

  playAnimation(plantId: number ,type:string): void {
    // Trigger the animation for the specific plant card
    // This could be a CSS class toggle that initiates an animation
    const plantCard = document.querySelector(`#plant-card-${plantId}`);
    if (plantCard) {
      if (type === 'watering')
      plantCard.classList.add('watering-animation');
      else if (type === 'fertilizing')
      plantCard.classList.add('fertilizing-animation');

      // Optionally, remove the animation class after it completes
      setTimeout(() => {
        plantCard.classList.remove('watering-animation');
        plantCard.classList.remove('fertilizing-animation');
      }, 2000); // Adjust the timeout to the length of your animation
    }
    else{
      console.error(`Could not find plant card with ID plant-card-${plantId}`);
    }
  }



}
