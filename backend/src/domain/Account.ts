import Document from "./Document";
import Email from "./Email";
import Name from "./Name";
import Password from "./Password";

export default class Account {
    balances: Balance[] = [];
    private name: Name;
    private email: Email;
    private document: Document;
    private password: Password;
    
    constructor(readonly accountId: string, name: string, email: string, document: string, password: string) {
        this.name = new Name(name);
        this.email = new Email(email);
        this.document = new Document(document);
        this.password = new Password(password)
       
    }

    static create(name: string, email: string, document: string, password: string): Account {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, document, password);
    }

    deposit(assetId: string, quantity: number){
        const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);
        if (balance) {
            balance.quantity += quantity;
        } else {
            this.balances.push({ assetId, quantity });
        }
    } 

    withdraw(assetId: string, quantity: number) {
        const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);
        if (!balance || balance.quantity < quantity) {
            throw new Error("Insufficient funds");
        }
        balance.quantity -= quantity;
        if (balance.quantity === 0) {
            this.balances = this.balances.filter(b => b.assetId !== assetId);
        }
    }

    getBalance (assetId: string) {
        const balance = this.balances.find((balance: Balance) => balance.assetId === assetId);
        if (!balance) return 0;
        return balance;
    }

    getName (){
        return this.name.getValue();
    }
    getEmail (){
        return this.email.getValue();
    }
    getDocument (){
        return this.document.getValue();
    }
    getPassWord (){
        return this.password.getValue()
    }
}

type Balance = {
    assetId: string;
    quantity: number;
};