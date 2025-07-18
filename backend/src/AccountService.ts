import crypto from "crypto";
import { validateEmail } from "./validateEmail";
import { validateName } from "./validateName";
import { validateCpf } from "./validateCpf";
import { validatePassword } from "./validatePassword";
import AccountDAO from "./AccountDAO";


export default class AccountService {
    
    constructor (readonly accountDAO: AccountDAO) {
    }     
    
    async signup (account : any) {
        account.accountId = crypto.randomUUID();
        if (!validateName(account.name)) throw new Error("Invalid name");
        if (!validateEmail(account.email)) throw new Error("Invalid email");
        if (!validateCpf(account.document)) throw new Error("Invalid document");
        if (!validatePassword(account.password)) throw new Error("Invalid password");    
        await this.accountDAO.save(account);
        return {
            accountId : account.accountId
        };    
    }
            
    async getAccount (accountId: string) {
        const account = await this.accountDAO.getById(accountId);
        return account;
    };
}

/*
app.post("/deposit", async (req: Request, res: Response) => {
    const deposit = req.body;
    console.log("/deposit", deposit);
    await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
        [deposit.accountId, deposit.assetId, deposit.quantity]);
    res.json({ success: true });
});


app.post("/withdraw", async (req: Request, res: Response) => {
    const account = req.body;
    console.log("/signup", account);
    const accountId = crypto.randomUUID();
    await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
        [accountId, account.name, account.email, account.document, account.password]);
    res.json({
        accountId
    });
});
*/

