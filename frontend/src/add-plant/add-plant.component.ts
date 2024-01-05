import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlantService } from '../services/plant.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.scss']
})
export class AddPlantComponent {
  addPlantForm: FormGroup;
  imageToUpload: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private plantService: PlantService,
    private authService: AuthService
  ) {
    this.addPlantForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      plant_type: ['', Validators.required],
      watering: ['', [Validators.required, Validators.min(1)]],
      fertilizing: ['', [Validators.required, Validators.min(1)]],
      reminder: ['']
    });
  }

  onSubmit(): void {
    if (!this.authService.isAuthenticated()) {
      this.errorMessage = 'User must be logged in to add a plant.';
      return;
    }

    const userId = this.authService.getUserIdFromToken();
    if (userId === null) {
      this.errorMessage = 'Cannot retrieve user ID. Please log in again.';
      return;
    }

    const formData = new FormData();
    formData.append('owner', userId.toString());
    Object.entries(this.addPlantForm.value).forEach(([key, value]) => {
      if (value != null) {
        const valueToSend = value instanceof Blob ? value : String(value);
        formData.append(key, valueToSend);
      }
    });

    if (this.imageToUpload) {
      formData.append('image', this.imageToUpload, this.imageToUpload.name);
    }

    this.plantService.addPlant(formData).subscribe(
      response => {
        this.successMessage = 'Plant added successfully';
        this.errorMessage = '';
        this.addPlantForm.reset();
      },
      error => {
        this.errorMessage = 'Failed to add plant: ' + error;
        this.successMessage = '';
      }
    );
  }

  handleFileInput(files: FileList | null): void {
    if (files && files.length > 0) {
      this.imageToUpload = files.item(0);
    }
  }
}
