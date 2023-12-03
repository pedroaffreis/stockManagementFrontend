import { Transaction } from "../transaction/transaction";

export interface Share{
   id:number;
   companyName:string;
   shareName:string;
   symbol:string;
   currency:string;
   country:string;
   economicField:string;
   transaction:Transaction[];}