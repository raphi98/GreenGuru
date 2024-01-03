import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenUrl = '/api/token/';
  private userUrl = '/api/users/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.tokenUrl, { username, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  register(user: { username: string; email: string; password: string; }): Observable<any> {
    return this.http.post(this.userUrl, {
      username: user.username,
      email: user.email,
      password1: user.password,
      password2: user.password
    });
  }

  getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }
    return this.validateToken(token).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }

  validateToken(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.tokenUrl, { headers });
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
