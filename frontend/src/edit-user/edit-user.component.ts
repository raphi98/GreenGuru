import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
    editForm: FormGroup;
    userId: number | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.editForm = this.formBuilder.group({
            username: [{value: '', disabled: true}, Validators.required],
            email: ['', [Validators.required, Validators.email]],
            currentPassword: [{value: '', disabled: true}, Validators.required],
            newPassword: [''],
            repeatPassword: ['']
        });
    }

    ngOnInit(): void {
        this.userId = this.authService.getUserIdFromToken();
        if (this.userId !== null) {
            this.loadUserDetails(this.userId);
        }
    }

    loadUserDetails(userId: number): void {
        this.authService.getUserDetails(userId).subscribe(
            userDetails => {
                this.editForm.patchValue({
                    username: userDetails.username,
                    email: userDetails.email
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
            email: formData.email,
            newPassword: formData.newPassword
        };

        if (!formData.newPassword) {
            delete updateData.newPassword;
        }

        this.authService.updateUserDetails(this.userId, updateData).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                console.error('Error updating user details', err);
                alert('There was an error: ' + err);
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/dashboard']);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
