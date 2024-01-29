import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {PlantService} from '../services/plant.service';
import {AuthService} from '../services/auth.service';
import {ApiService} from "../services/plant-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.scss']
})
export class AddPlantComponent implements OnInit {
  addPlantForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    plant_type: new FormControl('', [Validators.required]),
    watering: new FormControl(0, [Validators.required, Validators.min(1)]),
    fertilizing: new FormControl(0, [Validators.required, Validators.min(1)]),
    reminder: new FormControl(false)
  });

  plants: any[] | undefined;
  searchQuery: string = '';
  wateringPeriod: number = 0;

  errorMessage: string = '';
  successMessage: string = '';
  imagePreviewUrl: any = null;
  imageFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private plantService: PlantService, private authService: AuthService, private apiService: ApiService, private snackBar: MatSnackBar) {
  }

  onSubmit(): void {
    if (this.addPlantForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addPlantForm.value.name ?? '');
      formData.append('location', this.addPlantForm.value.location ?? '');
      formData.append('plant_type', this.addPlantForm.value.plant_type ?? '');
      formData.append('watering', this.addPlantForm.value.watering?.toString() ?? '0');

      formData.append('fertilizing', this.addPlantForm.value.fertilizing?.toString() ?? '0');
      formData.append('owner', this.authService.getUserIdFromToken()?.toString() ?? '0');

      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      this.plantService.addPlant(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Plant added successfully!';
          this.addPlantForm.reset();
          this.imagePreviewUrl = null;
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  handleFileInput(files: FileList): void {
    const file = files.item(0);
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreviewUrl = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

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
    const selectedOption = document.querySelector(`datalist#types option[value="${this.searchQuery}"]`);

    if (selectedOption) {
      const selectedPlantIdString = selectedOption.getAttribute('data-id');
      // @ts-ignore
      const selectedPlantId = parseInt(selectedPlantIdString, 10); // Parse as a number
      this.apiService.getPlantFromAPIById(selectedPlantId).subscribe((data: any) => {
        if (data.watering_general_benchmark && data.watering_general_benchmark.value !== null) {
          const wateringPeriod = data.watering_general_benchmark.value;
          const wateringPeriodParts = wateringPeriod.split('-');
          const firstNumber = wateringPeriodParts[0].trim();
          const wateringPeriodValue = parseInt(firstNumber, 10);
          this.addPlantForm.patchValue({
            watering: wateringPeriodValue
          });
          console.log(wateringPeriodValue);
        } else {
          console.log("Watering period data is null or undefined");
          this.snackBar.open('Watering period is not available for this plant', 'Okay', {
            duration: 5000,
          });
        }
      });
    }
  }
}
