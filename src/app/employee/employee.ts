import { Role } from "./role";
import { Transaction } from "../transaction/transaction";

export interface Employee{
    id:number;
    firstName:string;
    lastName:string;
    password:string;
    personalCode:bigint;
    email:string;
    address:string;
    phone:string;
    role:Role;
    transaction:Transaction[];
}

