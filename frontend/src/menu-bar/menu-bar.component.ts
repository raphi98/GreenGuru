import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {
  @Input() pageTitle!: string;
  username: string = '';
  userId: number | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsernameFromToken();
    this.userId = this.authService.getUserIdFromToken();
  }

  navigateToEditUser(): void {
    if (this.userId !== null) {
      this.router.navigate(['/edit-user', this.userId]);
    }
  }
}

