import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionComponent } from './transaction/transaction.component';
import { EmployeeComponent } from './employee/employee.component';
import { ShareComponent } from './share/share.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';




const routes: Routes = [
  { path: '', redirectTo: "login",pathMatch:"full" }, 
  { path: 'login', component: LoginComponent },
  { path: 'employee', component: EmployeeComponent }, 
  { path: 'transaction', component: TransactionComponent },
  { path: 'share', component: ShareComponent },

  { path: 'home', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }