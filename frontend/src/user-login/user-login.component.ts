import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.successMessage = 'Login erfolgreich!';
        },
        error: () => {
          this.errorMessage = 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.';
        }
      });
    } else {
      this.errorMessage = 'Bitte füllen Sie alle Felder korrekt aus.';
    }
  }
}
