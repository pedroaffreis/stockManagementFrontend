import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, catchError, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

  export class LoginService{
    private isAuthenticated = new BehaviorSubject<boolean>(false);
    private authTokenKey = 'auth-token';
    private loginUrl = 'http://localhost:8080/login';

      constructor(private http: HttpClient,private router: Router) { 
        this.checkTokenInLocalStorage()
      }
      private checkTokenInLocalStorage() {
        const authToken = localStorage.getItem(this.authTokenKey);
        if (authToken) {
          this.isAuthenticated.next(true);
          console.log("got the token");
          console.log(authToken);
        }
      }
    
      login(email: string, password: string): Observable<any> {
        const body = {
          email: email,
          password: password
        };
    
        const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    
        return this.http.post(this.loginUrl, body, { headers: headers, responseType: 'text' })
          .pipe(
            tap(token => {
              // Save the token in localStorage
              localStorage.setItem(this.authTokenKey, token);
              console.log(token);
              console.log("token is saved to localstorage");
              const decodeToken:any = this.decodeToken(token);
              const role:string = decodeToken.role;
              localStorage.setItem('user-role', role);
             
              this.isAuthenticated.next(true);
            }),
            catchError(error => {
              console.log('Authentication failed!');
              throw error;
            })
          );
      }

      decodeToken(token: string): any {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
      }

      logout() {
        // Remove token from localStorage and update authentication status
        localStorage.removeItem(this.authTokenKey);
        this.isAuthenticated.next(false);
        this.router.navigate(['/login']);
      }
    
      isAuthenticated$(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
      }

      getAuthToken(): string | null {
        console.log(localStorage.getItem(this.authTokenKey));
        console.log("token retrieved")
        return localStorage.getItem(this.authTokenKey);
      }

      getCurrentUserEmail(): string | null {
        const token = this.getAuthToken();
        if (!token) return null;
    
        const decoded = this.decodeToken(token);
        return decoded.email; 
      }
  }