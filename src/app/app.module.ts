import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TransactionComponent } from './transaction/transaction.component';
import { EmployeeComponent } from './employee/employee.component';
import { TransactionService } from './transaction/transaction.service';
import { AuthInterceptor } from './authInterceptor.service';

import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ShareComponent } from './share/share.component';
import { EmployeeService } from './employee/employee.service';
import { HomeComponent } from './home/home.component';

import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    TransactionComponent,
    EmployeeComponent,
    ShareComponent,
    LoginComponent,
    HomeComponent,
    SearchComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },TransactionService,EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }