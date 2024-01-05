import { Component } from '@angular/core';
import {NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  isRegisterRoute = false;
  isLoginRoute = false;
  isAddPlantRoute: boolean = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isRegisterRoute = event.url === '/register';
      this.isLoginRoute = event.url === '/login';
      this.isAddPlantRoute = event.url === '/add-plant';
    });
  }
}
