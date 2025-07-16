import express, { Request, Response } from "express"
import { getAccount, signup } from "./accountService";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response) => {
    const account = req.body;
    console.log("/signup", account);
    try {
        const output = await signup(account);
        res.json(output);        

    } catch (e: any) {
        res.status(422).json({
            message: e.message
        });
    }
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId
    console.log(`/accounts/${accountId}`);
    const output = await getAccount(accountId);
    res.json(output);
});

/*
app.post("/deposit", async (req: Request, res: Response) => {
    const deposit = req.body;
    console.log("/deposit", deposit);
    await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",
        [deposit.accountId, deposit.assetId, deposit.quantity]);
    res.json({ success: true });
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId
    console.log(`/accounts/${accountId}`);
    const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
    const accountAssetsData = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
    accountData.assets = [];
    for (const accountAssetData of accountAssetsData) {
        accountData.assets.push({
            assetId: accountAssetData.asset_id,
            quantity: parseFloat(accountAssetData.quantity)
        });
    }
    res.json(accountData);
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
app.listen(3000);

