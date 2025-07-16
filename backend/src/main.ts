import express, { Request, Response } from "express"
import crypto from "crypto"
//import cors from "cors";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";
const app = express();
app.use(express.json());

const connection = pgp()("postgres://postgres:123456@db:5432/app");

app.post("/signup", async (req: Request, res: Response) => {
    const account = req.body;
    console.log("/signup", account);

    if (!account.name || !account.email || !account.document || !account.password) {
        return res.json({ error: "All fields are required" });
    }
    if (!account.name.includes(" ")) {
        return res.json({ error: "Invalid name" });
    }
    if (!account.email.includes("@") || !account.email.includes(".")) {
        return res.json({ error: "Invalid email" });
    }
    if (!validateCpf(account.document)) {
        return res.json({ error: "Invalid document" });
    }
    if (!account.password.length || account.password.length < 8 || !/[a-z]/.test(account.password) || !/[A-Z]/.test(account.password) || !/\d/.test(account.password)) {
        return res.json({ error: "Invalid password" });
    }
    const accountId = crypto.randomUUID();
    await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)",
        [accountId, account.name, account.email, account.document, account.password]);
    res.json({
        accountId
    });
});

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


app.listen(3000);

