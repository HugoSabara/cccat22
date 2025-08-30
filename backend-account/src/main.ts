import { AccountDAODatabase } from "./infra/dao/AccountDAO";
import Registry from "./infra/di/Registry";
import { AccountAssetDAODatabase } from "./infra/dao/AccountAssetDAO";
import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import AccountController from "./infra/controller/AccountController";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { MediatorMemory } from "./infra/mediator/Mediator";
import ExecuteOrder from "./application/usecase/ExecuteOrder";
import { OrderRepositoryDatabase } from "./infra/repository/OrderRepository";
import Deposit from "./application/usecase/Deposit";
import GetOrder from "./application/usecase/GetOrder";
import GetDepth from "./application/usecase/GetDepth";
import Book from "./domain/Book";
import OrderController from "./infra/controller/OrderController";
import { OrderHandlerBook, OrderHandlerExecuteHttp, OrderHandlerExecuteOrder, OrderHandlerExecuteQueue } from "./infra/handler/OrderHandler";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import Order from "./domain/Order";
import PlaceOrder from "./application/usecase/PlaceOrder";
import UpdateOrder from "./application/usecase/UpdateOrder";
import CancelOrder from "./application/usecase/CancelOrder";
import Outbox from "./infra/outbox/Outbox";
import { CieloPaymentProcessor } from "./infra/fallback/PaymentProcessor";

//entrypoint
async function main() {
    const httpServer = new ExpressAdapter();
    const queue = new RabbitMQAdapter();
    Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter());
    Registry.getInstance().provide("outbox", new Outbox());
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.executeOrder");
    await queue.setup("orderFilled", "orderFilled.updateOrder");
    await queue.setup("orderRejected", "orderRejected.cancelOrder");
    await queue.setup("placeOrder", "placeOrder");
    Registry.getInstance().provide("mediator", new MediatorMemory());
    Registry.getInstance().provide("queue", queue);
    Registry.getInstance().provide("httpClient", new AxiosAdapter());
    Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
    Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
    Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase());
    Registry.getInstance().provide("paymentProcessor", new CieloPaymentProcessor());
    const orderRepository = new OrderRepositoryDatabase();
    Registry.getInstance().provide("orderRepository", orderRepository);
    Registry.getInstance().provide("httpServer", httpServer);
    Registry.getInstance().provide("signup", new Signup());
    Registry.getInstance().provide("getAccount", new GetAccount());
    Registry.getInstance().provide("deposit", new Deposit());
    Registry.getInstance().provide("placeOrder", new PlaceOrder());
    Registry.getInstance().provide("getOrder", new GetOrder());
    Registry.getInstance().provide("getDepth", new GetDepth());
    Registry.getInstance().provide("executeOrder", new ExecuteOrder());
    // BookManager objeto que tem vários books organizado por marketId
    Registry.getInstance().provide("book", new Book("BTC-USD"));
    Registry.getInstance().provide("updateOrder", new UpdateOrder());
    Registry.getInstance().provide("cancelOrder", new CancelOrder());
    //const handler = new OrderHandlerBook();
    //const handler = new OrderHandlerExecuteOrder();
    //const handler = new OrderHandlerExecuteHttp();
    const handler = new OrderHandlerExecuteQueue();
    handler.handle();
    new AccountController();
    new OrderController();
    httpServer.listen(3000);
}

main();

