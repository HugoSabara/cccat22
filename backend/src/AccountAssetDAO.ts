import pgp from "pg-promise";

export default interface AccountAssetDAO {
    save(account: any): Promise<void>;
    update(account: any): Promise<void>;
    getByAccountId(accountId: string): Promise<any>;    
}

export class AccountAssetDAODatabase implements AccountAssetDAO {

    async save(accountAsset: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@db:5432/app");
        await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
            [accountAsset.accountId, accountAsset.assetId, accountAsset.quantity]);
        await connection.$pool.end();
    }

    async update(accountAsset: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@db:5432/app");
        await connection.query("update ccca.account_asset set quantity = $1 where account_id= $2 and asset_id = $3",
            [accountAsset.quantity, accountAsset.accountId, accountAsset.assetId]);
        await connection.$pool.end();
    }

    async getByAccountId(accountId: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@db:5432/app");
        const accountAsset = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        await connection.$pool.end();
        return accountAsset;
    }
}