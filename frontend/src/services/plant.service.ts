import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  public plantUrl = '/api/plants/';

  constructor(private http: HttpClient) {}

  addPlant(plantData: any): Observable<any> {
    return this.http.post(this.plantUrl, plantData);
  }

  uploadImage(image: File, pk: number): Observable<any> {
    const uploadUrl = `${this.plantUrl}${pk}/image/`;
    const formData = new FormData();
    formData.append('plant_image', image, image.name);

    // Use the map operator with proper typing for the response
    return this.http.post<any>(uploadUrl, formData).pipe(
      map((response: any) => response.imageUrl) // Properly type 'response' and extract the image URL
    );
  }

  // Other plant-related methods...
}
