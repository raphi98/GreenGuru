import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
    editForm: FormGroup;
    userId: number | null = null;
    username: string = '';
    isEditedByAdmin: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {
        this.editForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            newPassword: ['', [Validators.minLength(4)]],
            repeatPassword: ['']
        });
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const routeUserId = +params['id'];
      this.userId = routeUserId || this.authService.getUserIdFromToken();
      this.isEditedByAdmin = !!routeUserId;

      if (this.userId) {
        this.loadUserDetails(this.userId);
      }
    });
  }

  loadUserDetails(userId: number): void {
    this.authService.getUserDetails(userId).subscribe(
      userDetails => {
        this.username = userDetails.username;
        this.editForm.patchValue({
          email: userDetails.email,
          username: userDetails.username
        });
      },
      error => {
        console.error('Error loading user details', error);
      }
    );
  }


  onSave(): void {
    if (this.editForm.invalid) {
      return;
    }

    if (this.userId === null) {
      alert('User ID is not available.');
      return;
    }

    const formData = this.editForm.value;

    if (formData.newPassword && formData.newPassword !== formData.repeatPassword) {
      alert('New Password does not match with Repeat New Password');
      return;
    }

    const updateData = {
      username: formData.username, email: formData.email
    };

    this.authService.updateUserDetails(this.userId, updateData).subscribe({
      next: () => {
        if (formData.newPassword) {
          this.authService.updatePassword(this.userId as number, formData.newPassword, formData.repeatPassword).subscribe({
            next: () => {
              this.snackBar.open('User details and password updated successfully', '',{
                duration: 2000,
              });
              setTimeout(() => {
                this.redirectAfterSave();
              }, 1000);
            },
            error: err => {
              console.error('Error updating password', err);
              this.snackBar.open('There was an error updating the password: ' + err, '',{
                duration: 5000,
              });
            }
          });
        } else {
          this.snackBar.open('User details updated successfully', '',{
            duration: 2000,
          });
          setTimeout(() => {
            this.redirectAfterSave();
          }, 1000);
        }
      },
      error: err => {
        console.error('Error updating user details', err);
        this.snackBar.open('There was an error updating user details: ' + err, '',{
          duration: 5000,
        });
      }
    });
  }

  redirectAfterSave(): void {
    if (this.isEditedByAdmin) {
      this.router.navigate(['/edit-user']);
    } else {
      this.router.navigate(['/edit-user']);
    }
  }
    onCancel(): void {
        this.router.navigate(['/edit-user']);
    }
}
