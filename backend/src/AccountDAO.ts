import pgp from "pg-promise";


export async function salveAccount(account: any) {
    const connection = pgp()("postgres://postgres:123456@db:5432/app");
    await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
        [account.accountId, account.name, account.email, account.document, account.password]);
    await connection.$pool.end();
}

export async function salveDeposit(deposit:any) {
    const connection = pgp()("postgres://postgres:123456@db:5432/app");
    await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
        [deposit.accountId, deposit.assetId, deposit.quantity]);
        await connection.$pool.end();    
};

export async function getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@db:5432/app");
    const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
    await connection.$pool.end();   
    return accountData;
};

export async function salveWithdraw (withDraw: any){
    const connection = pgp()("postgres://postgres:123456@db:5432/app");
    await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
        [withDraw.accountId, withDraw.name, withDraw.email, withDraw.document, withDraw.password]);
        await connection.$pool.end();      
        
};



