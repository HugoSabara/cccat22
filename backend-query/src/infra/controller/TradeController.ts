import { inject } from "../di/Registry";
import HttpServer from "../http/HttpServer";

export default class TradeController {
    @inject("httpServer")
    httpServer!: HttpServer;

    constructor () {
        this.httpServer.route("get", "/market/:marketId/depth", async (params: any, body: any) => {
            const marketId = params.marketId;
            console.log (marketId);
        });
    }

}