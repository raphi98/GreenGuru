import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRole = route.data['expectedRole'];
    if (expectedRole === 'admin') {
      return this.authService.isSuperuser().pipe(
        map(isSuperuser => {
          if (!isSuperuser) {
            this.router.navigate(['/dashboard']);
            return false;
          }
          return true;
        }),
        catchError(() => {
          this.router.navigate(['/dashboard']);
          return of(false);
        })
      );
    }

    return true;
  }
}
