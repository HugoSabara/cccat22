import express, { Request, Response } from "express"
import cors from "cors";
import { AccountDAODatabase } from "./AccountDAO";
import AccountService from "./AccountService";
import Registry from "./Registry";
import { AccountAssetDAODatabase } from "./AccountAssetDAO";
const app = express();
app.use(express.json());
app.use(cors());

Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
const accountService = new AccountService();

app.post("/signup", async (req: Request, res: Response) => {
    const account = req.body;
    console.log("/signup", account);
    try {
        const output = await accountService.signup(account);
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
    const output = await accountService.getAccount(accountId);
    res.json(output);
});

app.listen(3000);

