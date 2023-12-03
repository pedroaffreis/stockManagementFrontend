import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ShareService } from '../share/share.service';
import { EmployeeService } from '../employee/employee.service';
import { Balance } from '../share/balance';
import { TwelvedataService } from '../twelvedata/twelvedata.service';
import { Employee } from '../employee/employee';
import { EmployeeComponent } from '../employee/employee.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  [x: string]: any;
  isAuthenticated: boolean = false;
  updateProfile: Employee | undefined;
  shareBalances: Balance[] = [];
  isAdmin: boolean = false;
  currentUser: Employee | undefined;
  public errorMessage: string = '';
  public customPlaceholder: string = 'Search position...';
  searchKey: string = '';
  filteredShareBalances: Balance[] = [];

  constructor(private loginService: LoginService, private router: Router, private employeeService: EmployeeService, private shareService: ShareService, private twelvedataService: TwelvedataService) { }

  ngOnInit() {
    this.loadShareBalances();
    // this.loadCurrentUser();
    const userRole = localStorage.getItem('user-role');
    this.isAdmin = userRole === 'ROLE_ADMIN';
  }

  getRowClass(shareBalance: Balance): string {
    const totalReturnPercentage = this.getTotalReturnPercentage(shareBalance);
    return totalReturnPercentage >= 0 ? 'text-success' : 'text-danger';
  }

  formatPositiveNumber(number: any): string {
    const numericValue = +number;
    const formattedValue = numericValue.toFixed(2);
    return numericValue >= 0 ? `+${formattedValue}` : `${formattedValue}`;
  }

  getBookValue(shareBalance: Balance): number {
    return shareBalance.balance * shareBalance.bookPrice;
  }

  getCurrentMarketValue(shareBalance: Balance): number {
    return shareBalance.balance * shareBalance.currentPrice;
  }

  getTotalReturnPercentage(shareBalance: Balance): number {
    const bookValue = this.getBookValue(shareBalance);
    const marketValue = this.getCurrentMarketValue(shareBalance);
    const totalReturn = ((marketValue / bookValue - 1) * 100);
    return Number(totalReturn.toFixed(2));
  }

  loadShareBalances() {
    this.shareService.getBalances().subscribe(
      (balances: Balance[]) => {
        this.shareBalances = this.shareBalances = balances.filter(balance => balance.balance > 0);
        this.fetchCurrentQuote();
        this.filteredShareBalances = [...this.shareBalances];
        console.log('Share Balances:', this.shareBalances);
      },
      (error) => {
        console.error('Error fetching share balances: ', error);
      }
    );
  }

  fetchCurrentQuote() {
    this.shareBalances.forEach((balance) => {
      this.twelvedataService.getCurrentPrice(balance.symbol).subscribe(
        (response: any) => {
          balance.currentPrice = response.price;
        },
        (error) => {
          console.error(`Error fetching current quote for ${balance.symbol}: `, error);
        }
      );
    });

  }

handleSearch(searchText: string): void {
    this.filteredShareBalances = this.shareBalances.filter(shareBalance =>
      shareBalance.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
      shareBalance.shareName.toLowerCase().includes(searchText.toLowerCase())
    );
    if (this.filteredShareBalances.length === 0) {
      this.errorMessage = 'No matching records found.';
    } else {
      this.errorMessage = '';
    }
  }

  onSearchTextEntered(key: string) {
    this.searchKey = key;
    this.handleSearch(this.searchKey);
  }

  logout() {
    this.loginService.logout();
  }
}
