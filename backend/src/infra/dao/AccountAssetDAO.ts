import DataBaseConnection from "../database/DataBaseConnection";
import { inject } from "../di/Registry";

export default interface AccountAssetDAO {
    save(account: any): Promise<void>;
    update(account: any): Promise<void>;
    deleteByAccountId(accountId: string): Promise<void>;
    getByAccountId(accountId: string): Promise<any>;
}

//Interface Adapter
export class AccountAssetDAODatabase implements AccountAssetDAO {
    @inject("databaseConnection")
    connection!: DataBaseConnection;

    async save(accountAsset: any): Promise<void> {
        await this.connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
            [accountAsset.accountId, accountAsset.assetId, accountAsset.quantity]);
    }

    async update(accountAsset: any): Promise<void> {
        await this.connection.query("update ccca.account_asset set quantity = $1 where account_id= $2 and asset_id = $3",
            [accountAsset.quantity, accountAsset.accountId, accountAsset.assetId]);
    }

    async getByAccountId(accountId: string): Promise<any> {
        const accountAsset = await this.connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        return accountAsset;
    }

    async deleteByAccountId(accountId: string): Promise<void> {
        await this.connection.query("delete from ccca.account_asset where account_id = $1", [accountId]);
    }
}