import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwelvedataService {

  constructor(private http: HttpClient) { }

  private apiKey = '08d34a01f72a4334acef959e30f4ca8f';
  private apiUrl = 'https://api.twelvedata.com';

  getCurrentPrice(symbol: string) {
    const url = `${this.apiUrl}/price?symbol=${symbol}&apikey=${this.apiKey}`;
    return this.http.get(url);
  }
}
