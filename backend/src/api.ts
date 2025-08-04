import { AccountDAODatabase } from "./infra/dao/AccountDAO";
import Registry from "./infra/di/Registry";
import { AccountAssetDAODatabase } from "./infra/dao/AccountAssetDAO";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import AccountController from "./infra/controller/AccountController";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import Mediator, { MediatorMemory } from "./infra/mediator/Mediator";
import ExecuteOrder from "./application/usecase/ExecuteOrder";

//entrypoint
async function main() {
    const httpServer = new ExpressAdapter();
    Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
    Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
    Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().provide("httpServer", httpServer);
    Registry.getInstance().provide("signup", new Signup());
    Registry.getInstance().provide("getAccount", new GetAccount());
    const executeOrder = new ExecuteOrder();
    const mediator = new MediatorMemory();
    Registry.getInstance().provide("mediator", mediator);
    mediator.register("orderPlaced", async (event: any) =>{
        await executeOrder.execute(event.marketId);
    });
    new AccountController()
    httpServer.listen(3000);
}

main();

