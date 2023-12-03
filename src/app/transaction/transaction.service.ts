import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Transaction } from "./transaction";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiServerUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    public getAllTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiServerUrl}/transaction/all`);
   }
   
    public addTransaction(transaction: Transaction, empId: number, secId: string): Observable<Transaction> {
        const params = new HttpParams()
          .set('empId', empId.toString())
          .set('secId', secId);
    
        return this.http.post<Transaction>(`${this.apiServerUrl}/transaction/add`, transaction, { params: params });
      }

    public updateTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiServerUrl}/transaction/update`, transaction);
    }
    public deleteTransaction(transactionId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/transaction/delete/${transactionId}`);
    }
    public getTransactionById(transactionId: number): Observable<Transaction> {
        return this.http.get<Transaction>(`${this.apiServerUrl}/transaction/find/${transactionId}`);
    }
}