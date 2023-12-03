import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { environment } from "src/environments/environments";
import { Employee } from "./employee";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
  })
  export class EmployeeService{
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getAllEmployees():Observable<Employee[]>{
        return this.http.get<Employee[]>(`${this.apiServerUrl}/employee/all`);
    }

    public addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiServerUrl}/employee/add`, employee)
          .pipe(
            catchError(this.handleError)
          );
      }

    public updateEmployee(employee:Employee):Observable<Employee>{
        return this.http.put<Employee>(`${this.apiServerUrl}/employee/update`,employee);
    }
    public deleteEmployee(employeeId:number):Observable<void>{
        return this.http.delete<void>(`${this.apiServerUrl}/employee/delete/${employeeId}`);
    }
    public getEmployeeById(employeeId:number):Observable<Employee>{
        return this.http.get<Employee>(`${this.apiServerUrl}/employee/find/${employeeId}`);
    }

    public getEmployeeByTransactionId(transactionId: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiServerUrl}/employee/findEmp/${transactionId}`);
    }

    getCurrentUser(): Observable<Employee> {
        // Assuming the endpoint to get the current user's data is '/employee/current'
        return this.http.get<Employee>(`${this.apiServerUrl}/employee/current`);
      }

      private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An error occurred. Please try again later.';
    
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.status === 409) {
          errorMessage = error.error; // Assuming the backend sends the error message in the response body
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }
  }