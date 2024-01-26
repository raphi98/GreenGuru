import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl = 'https://perenual.com/api';

  constructor(private http: HttpClient) {
  }

  getPlantsFromAPI(searchterm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/species-list?key=sk-94iG659ecb144787f3738&q=${searchterm}`);
  }

  getPlantFromAPIById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/species/details/${id}?key=sk-94iG659ecb144787f3738`);
  }

}
