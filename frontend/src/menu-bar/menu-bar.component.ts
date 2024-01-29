import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {Observable} from "rxjs";
import {Plant} from "../models/plant";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {
  @Input() pageTitle!: string;
  username: string = '';
  showDropdown: boolean = false;
  userId: number | null = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserIdFromToken();
    if (this.userId !== null) {
      this.loadUserName(this.userId);
      this.checkIfAdmin();
    }
  }

  checkIfAdmin(): void {
    this.authService.isSuperuser().subscribe(
      isSuperuser => {
        this.isAdmin = isSuperuser;
      },
      error => {
        console.error('Error checking admin status', error);
      }
    );
  }

  loadUserName(userId: number): void {
    this.authService.getUserDetails(userId).subscribe(
      userName => {
        if (userName.username.length > 10) {
          this.username = 'icon';
        } else {
          this.username = userName.username;
        }
      },
      error => {
        console.error('Error loading username', error);
      }
    );
  }

  navigateToEditUser(): void {
    if (this.userId !== null) {
      this.router.navigate(['/edit-user', this.userId]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

