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
  imagePreviewUrl: string | null = null;

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

    const plantData = {
      name: this.addPlantForm.value.name,
      location: this.addPlantForm.value.location,
      plant_type: this.addPlantForm.value.plant_type,
      watering: this.addPlantForm.value.watering,
      fertilizing: this.addPlantForm.value.fertilizing,
      owner: userId
    };

    this.plantService.addPlant(plantData).subscribe(
      response => {
        this.successMessage = 'Pflanze erfolgreich hinzugefügt.';
        const newPlantId = response.id;
        if (this.imageToUpload && newPlantId != null) {
          this.uploadImage(newPlantId, this.imageToUpload);
        } else {
          this.resetForm();
        }
      },
      error => {
        console.error('Fehler beim Hinzufügen der Pflanze:', error);
        this.errorMessage = 'Fehler beim Hinzufügen der Pflanze: ' + (error.error.message || error.message);
      }
    );
  }

  uploadImage(plantId: number, imageFile: File): void {
    this.plantService.uploadImage(imageFile, plantId).subscribe(
      imageUrl => {
        this.successMessage += ' Bild erfolgreich hochgeladen. Bild-URL: ' + imageUrl;
        this.resetForm();
        // Here you can also update the plant JSON with the image URL if needed
      },
      error => {
        this.errorMessage = 'Fehler beim Hochladen des Bildes: ' + (error.error.message || error.message);
      }
    );
  }

  resetForm(): void {
    this.addPlantForm.reset();
    this.imagePreviewUrl = null;
    this.imageToUpload = null;
    setTimeout(() => this.successMessage = '', 5000); // Erfolgsmeldung nach 5 Sekunden löschen
  }

  handleFileInput(files: FileList | null): void {
    if (files && files.length > 0) {
      this.imageToUpload = files.item(0);
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreviewUrl = event.target.result;
      };
      if (this.imageToUpload) {
        reader.readAsDataURL(this.imageToUpload);
      }
    }
  }
}
