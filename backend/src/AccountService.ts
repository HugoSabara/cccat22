import crypto from "crypto";
import { validateEmail } from "./validateEmail";
import { validateName } from "./validateName";
import { validateCpf } from "./validateCpf";
import { validatePassword } from "./validatePassword";
import { inject } from "./Registry";
import AccountDAO from "./AccountDAO";
import AccountAssetDAO from "./AccountAssetDAO";


export default class AccountService {
    @inject("accountDAO")
    accountDAO!: AccountDAO;
    @inject("accountAssetDAO")
    accountAssetDAO!: AccountAssetDAO;

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
         if (!account) throw new Error("Account not found");
        account.balances = await this.accountAssetDAO.getByAccountId(accountId);
        return account;
    }

    async deposit (acccountAsset: any){
        const account = await this.accountDAO.getById(acccountAsset.accountId);
        if (!account) throw new Error("Account not found");
        await this.accountAssetDAO.save(acccountAsset);
    }

    async withdraw (acccountAsset: any){
        const account = await this.getAccount(acccountAsset.accountId);
        const balance = account.balances.find((balance: any) => balance.asset_id === acccountAsset.assetId);
        const quantity = parseFloat(balance.quantity) - acccountAsset.quantity;
        if (quantity < 0) throw new Error("Insufficient funds");
        await this.accountAssetDAO.update({accountId: acccountAsset.accountId, assetId: acccountAsset.assetId, quantity});
    }
}


