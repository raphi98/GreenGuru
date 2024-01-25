import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.tokenUrl, { username, password }).pipe(
      tap(response => {
        if (response && response.access) {
          this.setToken(response.access);
        }
      }),
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
    const token = localStorage.getItem('authToken');
    return token || '';
  }


  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getUserIdFromToken(): number | null {
    const accessToken = this.getToken();
    if (!accessToken) return null;

    try {
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format', accessToken);
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return parseInt(payload.user_id);
    } catch (error) {
      return null;
    }
  }

  getUsernameFromToken(): string {
    const accessToken = this.getToken();
    if (!accessToken) return 'token error';

    try {
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format', accessToken);
        return 'token error';
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload.username || 'username';
    } catch (error) {
      console.error('Error decoding token', error);
      return 'token error';
    }
  }

  getUserDetails(userId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.getToken()
      })
    };
    return this.http.get(`${this.userUrl}${userId}`, httpOptions);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
