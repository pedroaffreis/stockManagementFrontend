import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environments";
import { LoginService } from "./login/login.service";

@Injectable({
    providedIn: 'root'
  })

  export class AuthInterceptor implements HttpInterceptor{

    constructor(private router: Router, private loginService: LoginService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.loginService.getAuthToken(); // Get the access token from storage
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          }
        });
      }
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Handle token expiry, for example, redirect to login page
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
        );
      }
    }