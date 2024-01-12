import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlantService } from '../services/plant.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.scss']
})
export class AddPlantComponent {
  addPlantForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    plant_type: new FormControl('', [Validators.required]),
    watering: new FormControl(0, [Validators.required, Validators.min(1)]),
    fertilizing: new FormControl(0, [Validators.required, Validators.min(1)]),
    reminder: new FormControl(false)
  });

  errorMessage: string = '';
  successMessage: string = '';
  imagePreviewUrl: any = null;
  imageFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private plantService: PlantService, private authService: AuthService) {}

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
}
