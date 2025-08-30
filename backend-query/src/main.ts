import { PgPromiseAdapter } from "./infra/database/DataBaseConnection";
import Registry from "./infra/di/Registry";
import { AxiosAdapter } from "./infra/http/HttpClient";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { MediatorMemory } from "./infra/mediator/Mediator";
import { RabbitMQAdapter } from "./infra/queue/Queue";

async function main () {
    const connection = new PgPromiseAdapter();
    const httpServer = new ExpressAdapter();
    const httpClient = new AxiosAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    await queue.setup("orderPlaced", "orderPlaced.executeOrder");
    await queue.setup("orderFilled", "orderFilled.updateOrder");
    await queue.setup("orderRejected", "orderRejected.cancelOrder");
    await queue.setup("orderExecuted", "orderExecuted.updateDepth");
    const mediator = new MediatorMemory();
    Registry.getInstance().provide("mediator", mediator);
    queue.consume("orderExecuted.updateDepth", async (input: any) => {
        console.log("updateDepth");
        const data = { buys: input.buys, sells: input.sells };
        await connection.query("insert into ccca.depth (market_id, data) values ($1, $2) on conflict (market_id) do update set data = excluded.data", [input.marketId, data]);
    });
    httpServer.listen(3002);
}

main();