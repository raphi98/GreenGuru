import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private plantsUrl = '/api/plants/';

  constructor(private http: HttpClient) {}

  getPlant(id: number): Observable<any> {
    return this.http.get(`${this.plantsUrl}${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updatePlant(id: number, plantData: FormData): Observable<any> {
    return this.http.put(`${this.plantsUrl}${id}/`, plantData).pipe(
      catchError(this.handleError)
    );
  }

  addPlant(plantData: FormData): Observable<any> {
    return this.http.post(this.plantsUrl, plantData).pipe(
      catchError(this.handleError)
    );
  }

  deletePlant(id: number): Observable<any> {
    return this.http.delete(`${this.plantsUrl}${id}`).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
