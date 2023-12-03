
import { Component, OnInit, ViewChild } from '@angular/core';
import { Share } from './share';
import { ShareService } from './share.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login/login.service';
@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
    public shares: Share[] =[];
    public editShare: Share | undefined | null;
    isAdmin:boolean = false;
    public errorMessage: string = '';
    public customPlaceholder: string = 'Search shares...';
    searchKey: string = '';
    filteredShares: Share[] = [];
    public addError:string='';
    public updateError:string='';

    @ViewChild('addForm', { static: false }) addForm!: NgForm;

    constructor(private shareService: ShareService, private router: Router, private loginService: LoginService) { }
    ngOnInit() {
        this.getAllShares();
        const userRole = localStorage.getItem('user-role');
        this.isAdmin=userRole === 'ROLE_ADMIN';
    }
    goToEmployee(): void {
        this.router.navigate(['/share']); // Navigate to the '/share' route
    }
    public getAllShares(): void {
        this.shareService.getAllShares().subscribe(
            (response: Share[]) => {
                this.shares = response;
                console.log(this.shares);
                this.filteredShares = [...this.shares]
            },
            (error: HttpErrorResponse) => {
                alert(error.message)
            }
        )
    }

    logout(){
        this.loginService.logout();
      }
    //Method to handle the addition of a new share
    public onAddShare(addForm: NgForm): void {
        this.shareService.addShares(addForm.value).subscribe(
            (response: Share) => {
                console.log(response);
                this.getAllShares();
                addForm.reset();
                this.closeAddShareModal();
            },
            (error: HttpErrorResponse) => {
                console.log(error);
                if (error.status === 409) {
                    this.addError = error.error;
                }
            }
        );
    }

    public closeAddShareModal(): void {
        const modal = document.getElementById('addShareModal');
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
    //To handle updating existing share
    public onUpdateShare(formValues: any): void {
        this.updateError = '';
        const updatedShare: Share = { ...this.editShare, ...formValues };
        this.shareService.updateShare(updatedShare).subscribe(
            (response: Share) => {
                console.log(response);
                this.getAllShares();
                this.closeUpdateShareModal(); 
            },
            (error: HttpErrorResponse) => {
                console.log(error);
                if (error.status === 500) {
                    this.updateError = error.error; // Access the custom error message
                }
            }
        );
    }

    public closeUpdateShareModal(): void {
        const modal = document.getElementById('updateShareModal');
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

    public onOpenModal(share: Share | null, mode: string): void {
        // Method to handle modal window for adding, editing or deleting an share
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (mode === 'add') {
            button.setAttribute('data-target', '#addShareModal');
        }
        if (mode === 'edit') {
            this.editShare = share; // Assign the share to be edited to the editShare object
            button.setAttribute('data-target', '#updateShareModal');
        }
        if (container) {
            container.appendChild(button);
        }
        button.click();
    }
    
    handleSearch(searchText: string): void {
        this.filteredShares = this.shares.filter(share =>
            share.companyName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || share.shareName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || share.symbol.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || share.currency.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || share.country.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
                || share.economicField.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        );
        if (this.filteredShares.length === 0) {
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