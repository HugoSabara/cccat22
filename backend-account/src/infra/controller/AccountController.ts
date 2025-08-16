import Deposit from "../../application/usecase/Deposit";
import GetAccount from "../../application/usecase/GetAccount";
import Signup from "../../application/usecase/Signup";
import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";


//Interface Adapter
export default class AccountController {
    @inject("httpServer")
    httpServer!: HttpServer;
    @inject("signup")
    signup!:Signup
    @inject("getAccount")
    getAccount!: GetAccount;
    @inject("deposit")
    deposit!: Deposit;

    constructor() {
        this.httpServer.route("post", "/signup", async (params: any, body: any) => {
            const output = await this.signup.execute(body);
            return output;
        });

        this.httpServer.route("get", "/accounts/:accountId", async (params: any, body: any) => {
            const output = await this.getAccount.execute(params.accountId);
            return output;
        });
          this.httpServer.route("post", "/deposit", async (params: any, body: any) => {
            const output = await this.deposit.execute(body);
            return output;
        });
    }
}