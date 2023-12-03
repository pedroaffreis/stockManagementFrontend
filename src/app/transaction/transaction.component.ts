import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Transaction } from "./transaction";
import { TransactionService } from "./transaction.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subject, debounceTime } from "rxjs";
import { ShareService } from "../share/share.service";
import { Share } from "../share/share";
import { Employee } from "../employee/employee";
import { EmployeeService } from "../employee/employee.service";
import { LoginService } from "../login/login.service";

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.css']
  })
  export class TransactionComponent implements OnInit {

  transactions: Transaction[]=[];
  public editTransaction:Transaction | undefined | null;
  public deleteTransaction:Transaction | undefined | null;
  isAdmin:boolean = false;
  public customPlaceholder: string = 'Search transaction...';
  public errorMessage: string = '';
  searchKey: string = '';
  filteredTransactions: Transaction[] = [];
  public addError:string='';
  public updateError:string='';
  public deleteError:string='';

  @ViewChild('addForm', { static: false }) addForm!: NgForm;


  constructor(private transactionService: TransactionService,private router: Router,private shareService:ShareService, private employeeService:EmployeeService, private loginService: LoginService) {}

  title = 'Transactions';
  ngOnInit() {
      this.getTransactionsWithShares();
      const userRole = localStorage.getItem('user-role');
        this.isAdmin=userRole === 'ROLE_ADMIN';
}
  
  
  goToTransactions(): void {
    this.router.navigate(['/transaction']); // Navigate to the '/transaction' route
  }

  logout(){
    this.loginService.logout();
  }

  public getTransactionsWithShares(): void {
    this.transactionService.getAllTransactions().subscribe(
      (response: Transaction[]) => {
        this.transactions = response;
        this.attachShareInfoToTransactions();
        console.log(this.transactions);
        this.filteredTransactions = [...this.transactions]
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  
  private attachShareInfoToTransactions(): void {
    if (this.transactions) {
      this.transactions.forEach(transaction => {
        this.shareService.getShareByTransactionId(transaction.id).subscribe(
          (share: Share) => {
            transaction.share = share;
          },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
        this.employeeService.getEmployeeByTransactionId(transaction.id).subscribe(
          (employee: Employee) => {
            transaction.employee = employee;
          },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
      });
    }
  }
  public onAddTransaction(addForm: NgForm): void {
    const empId = addForm.value.empId;
    const secId = addForm.value.secId;
  this.transactionService.addTransaction(addForm.value, empId, secId).subscribe(
    (response: Transaction) => {
      console.log(response);
      this.getTransactionsWithShares();
      addForm.reset();
      this.closeAddTransactionModal();
    },
    (error: HttpErrorResponse) => {
      console.log(error);
      if (error.status === 409) {
          this.addError = error.error;
      }
    }
  );
  }

  public closeAddTransactionModal(): void {
    const modal = document.getElementById('addTransactionModal');
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

  //To handle updating existing transaction
  public onUpdateTransaction (transaction:Transaction): void {
    this.updateError = '';
    this.transactionService.updateTransaction(transaction).subscribe(
      (response:Transaction) => {
        console.log(response);
        this.getTransactionsWithShares()
        this.closeUpdateTransactionModal(); 
      },
      (error:HttpErrorResponse) => {
        console.log(error);
        if (error.status === 409) {
          this.updateError = error.error; // Access the custom error message
      }
      }
      
    )
  }

  public closeUpdateTransactionModal(): void {
    const modal = document.getElementById('updateTransactionModal');
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

  //To handle deletion of a transaction
  public onDeleteTransaction (transactionId:number|undefined):void {
    
    if (transactionId == undefined){
      return;
    }
    this.deleteError = '';
    this.transactionService.deleteTransaction(transactionId).subscribe(
      (response:void) => {
        console.log(response);
        this.getTransactionsWithShares();
          this.closeDeleteTransactionModal();
        
      },
      (error:HttpErrorResponse) => {
        console.log(error);
                if (error.status === 409) {
                    this.deleteError = error.error; // Access the custom error message
                }
              }
            );
          }

  public closeDeleteTransactionModal(): void {
    const modal = document.getElementById('deleteTransactionModal');
    if (modal) {
        modal.style.display = 'none';  
        document.body.classList.remove('modal-open'); 
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    }
    this.deleteError = '';
}

  public onOpenModal(transaction: Transaction | null, mode: string): void {
    // Method to handle modal window for adding, editing or deleting a transaction
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addTransactionModal');
    }
    if (mode === 'edit') {
      this.editTransaction = transaction; // Assign the transaction to be edited to the editEmployee object
      button.setAttribute('data-target', '#updateTransactionModal');
    }
    if (mode === 'delete') {
      this.deleteTransaction = transaction; // Assign the transaction to be deleted to the deleteEmployee object
      button.setAttribute('data-target', '#deleteTransactionModal');
    }
    if(container){
      container.appendChild(button);
    }
    button.click();
  }


  handleSearch(searchText: string): void {
    this.filteredTransactions = this.transactions.filter(transaction =>
      transaction.share.symbol.toLowerCase().includes(searchText) ||
      transaction.share.currency.toLowerCase().includes(searchText) ||
      transaction.volume.toString().includes(this.searchKey) ||
      transaction.price.toString().includes(this.searchKey) ||
      transaction.employee.firstName.toLowerCase().includes(searchText) ||
      transaction.employee.lastName.toLowerCase().includes(searchText)
    );
    if (this.filteredTransactions.length === 0) {
      this.errorMessage = 'No matching records found.';
    } else {
      this.errorMessage = '';
    }
}

  onSearchTextEntered(key: string) {
    this.searchKey = key;
    this.handleSearch(this.searchKey);
}
  }