import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login/login.service';



@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit {
    employees: Employee[] = [];
    public editEmployee: Employee | undefined | null;
    public updateProfile: Employee | undefined | null;
    public deleteEmployee: Employee | undefined | null;
    isAdmin:boolean = false;
    public errorMessage: string = '';
    public addError:string='';
    public updateError:string='';
    public customPlaceholder: string = 'Search employee...';
    searchKey: string = '';
    filteredEmployees: Employee[] = [];
    


    @ViewChild('addForm', { static: false }) addForm!: NgForm;
   

    constructor(private employeeService: EmployeeService, private router: Router, private loginService: LoginService) { }

    navigateToSharePage() {
        // You can use the Angular Router to navigate to the "share" page
        this.router.navigate(['./share']);
    }


    ngOnInit() {
        this.getAllEmployees();
        const userRole = localStorage.getItem('user-role');
        this.isAdmin = userRole === 'ROLE_ADMIN';
    }

    logout() {
        this.loginService.logout();
    }

    goToEmployee(): void {
        this.router.navigate(['/employee']); // Navigate to the '/employee' route
    }

    public getAllEmployees(): void {
        this.employeeService.getAllEmployees().subscribe(
            (response: Employee[]) => {
                this.employees = response;
                console.log(this.employees);
                this.filteredEmployees = [...this.employees]
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
            }
        )
    }

    //Method to handle the addition of a new employee
    public onAddEmployee(addForm: NgForm): void {
        this.addError = '';  // Reset error message
        this.employeeService.addEmployee(addForm.value).subscribe(
            (response: Employee) => {
                console.log(response);
                addForm.reset();
                this.getAllEmployees();
                this.closeAddEmployeeModal(); 
            },
            (error) => {
                console.log(error);
                this.addError = error;
            }
        );
    }
    public closeAddEmployeeModal(): void {
        const modal = document.getElementById('addEmployeeModal');
        if (modal) {
            modal.style.display = 'none';  
            document.body.classList.remove('modal-open'); 
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            if (this.addForm) {
                this.addForm.resetForm();
                this.addError = '';
            }

        }
    }

    public closeUpdateEmployeeModal(): void {
        const modal = document.getElementById('updateEmployeeModal');
        if (modal) {
            modal.style.display = 'none';  
            document.body.classList.remove('modal-open'); 
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
        }
        this.updateError = '';
    }
    
    //To handle updating existing employee
    public onUpdateEmployee(formValues: any): void {
        this.updateError = '';
        const updatedEmployee: Employee = { ...this.editEmployee, ...formValues };
        this.employeeService.updateEmployee(updatedEmployee).subscribe(
            (response: Employee) => {
                console.log(response);
                this.getAllEmployees();
                this.closeUpdateEmployeeModal(); 
            },
            (error: HttpErrorResponse) => {
                console.log(error);
                if (error.status === 409) {
                    this.updateError = error.error; // Access the custom error message
                }
            }
        );
    }

    public onOpenModal(employee: Employee | null, mode: string): void {
        // Method to handle modal window for adding, editing or deleting an employee
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'add') {
            button.setAttribute('data-target', '#addEmployeeModal');
        }
        if (mode === 'edit') {
            this.editEmployee = employee; // Assign the employee to be edited to the editEmployee object
            button.setAttribute('data-target', '#updateEmployeeModal');
        }
        if (mode === 'delete') {
            this.deleteEmployee = employee; // Assign the employee to be deleted to the deleteEmployee object
            button.setAttribute('data-target', '#deleteEmployeeModal');
        }
        if (container) {
            container.appendChild(button);
        }
        button.click();
    }

    handleSearch(searchText: string): void {
        this.filteredEmployees = this.employees.filter(employee =>
            employee.firstName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.lastName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                ||  (employee.personalCode?.toString().includes(searchText))
                || employee.email.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.address.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.phone.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || employee.role.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
        if (this.filteredEmployees.length === 0) {
          this.errorMessage = 'No matching records found.';
        } else {
          this.errorMessage = '';
        }
    }
    
      onSearchTextEntered(key: string) {
        this.searchKey = key;
        this.handleSearch(this.searchKey);
    }

    public onDeleteEmployee(employeeId: number | undefined): void {
        if (employeeId == null) {
            return;
        }
        this.employeeService.deleteEmployee(employeeId).subscribe(
            (response: void) => {
                console.log(response);
                this.getAllEmployees();
            },
            (error: HttpErrorResponse) => {
                alert(error.message);
            }
        )
    }

}