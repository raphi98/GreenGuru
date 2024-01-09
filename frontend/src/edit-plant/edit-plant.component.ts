import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../services/plant.service';

@Component({
  selector: 'app-edit-plant',
  templateUrl: './edit-plant.component.html',
  styleUrls: ['./edit-plant.component.scss']
})
export class EditPlantComponent implements OnInit {
  editPlantForm = new FormGroup({
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
  plantId!: number;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private plantService: PlantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.plantId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlantData();
  }

  loadPlantData(): void {
    this.plantService.getPlant(this.plantId).subscribe({
      next: (plant) => {
        this.editPlantForm.patchValue(plant);
        this.imagePreviewUrl = plant.image; // Update this line if you receive image URL differently
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
  }

  onSubmit(): void {
    if (this.editPlantForm.valid) {
      const formData = new FormData();
      formData.append('name', this.editPlantForm.value.name ?? '');
      formData.append('location', this.editPlantForm.value.location ?? '');
      formData.append('plant_type', this.editPlantForm.value.plant_type ?? '');
      formData.append('watering', this.editPlantForm.value.watering?.toString() ?? '0');
      formData.append('fertilizing', this.editPlantForm.value.fertilizing?.toString() ?? '0');
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      this.plantService.updatePlant(this.plantId, formData).subscribe({
        next: () => {
          this.successMessage = 'Plant updated successfully!';
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this plant?')) {
      this.plantService.deletePlant(this.plantId).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
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
