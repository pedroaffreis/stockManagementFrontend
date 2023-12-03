import { Employee } from "../employee/employee";
import { Share } from "../share/share";
import { TransactionType } from "./transactiontype";

export interface Transaction{
   id:number;
   type:TransactionType;
   share:Share;
   volume:number;
   price:number;
   fx:number;
   currency:string;
   date:Date;
   employee:Employee; 
}