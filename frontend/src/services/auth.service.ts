import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      return payload.user_id;
    } catch (error) {
      return null;
    }
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
