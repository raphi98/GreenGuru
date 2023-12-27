import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    }, { validators: this.passwordMatchingValidator });
  }

  private passwordMatchingValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsNotMatching: true };
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.getTokenAndRegister();
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      this.successMessage = '';
    }
  }

  private getTokenAndRegister() {
    this.http.post<any>('/api/token/', {
      username: this.registrationForm.value.username,
      password: this.registrationForm.value.password
    }).subscribe({
      next: (tokenResponse) => {
        localStorage.setItem('token', tokenResponse.token);
        this.registerUser();
      },
      error: (error) => {
        this.errorMessage = 'Error fetching token.';
        this.successMessage = '';
      }
    });
  }

  private registerUser() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post('/api/users/', this.registrationForm.value, { headers })
      .subscribe({
        next: (response) => {
          this.successMessage = 'User registered successfully!';
          this.registrationForm.reset();
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'An error occurred during registration.';
          this.successMessage = '';
        }
      });
  }
}
