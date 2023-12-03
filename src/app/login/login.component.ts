
import { AuthInterceptor } from "../authInterceptor.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environments";
import { Observable, catchError, tap, throwError } from "rxjs";
import { LoginService } from "./login.service";
import { Component } from "@angular/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private loginService: LoginService, private router: Router) { }

  onSubmit(): void {
    this.loginService.login(this.email, this.password)
      .subscribe(
        () => {
          const userRole = localStorage.getItem('user-role');
          console.log(`User's Role: ${userRole}`);
          this.router.navigate(['/home']);
          console.log('Login successful');
        },
        error => {
          this.loginError = true; 
          this.clearForm();
          console.error('Login failed', error);
        }
      );
  }

  clearForm(): void {
    this.email = ''; // Clear email input
    this.password = ''; // Clear password input
  }
}