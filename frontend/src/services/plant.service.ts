import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private plantUrl = '/api/plants/';

  constructor(private http: HttpClient) {}

  addPlant(data: FormData): Observable<any> {
    return this.http.post(this.plantUrl, data);
  }

  // Other plant-related methods like getPlants, updatePlant, deletePlant can be added here
}
