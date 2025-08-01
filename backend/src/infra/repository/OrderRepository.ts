import Order from "../../domain/Order";
import DataBaseConnection from "../database/DataBaseConnection";
import { inject } from "../di/Registry";

export default interface OrderRepository {
    save(order: Order): Promise<void>;
    update(order: Order): Promise<void>;
    getById(orderId: string): Promise<Order>;
    getByMarketIdAndStatus (marketId: string, status: string): Promise<Order[]>;
}

export class OrderRepositoryDatabase implements OrderRepository {
    @inject("databaseConnection")
    connection!: DataBaseConnection;
    
    async save(order: Order): Promise<void> {
        await this.connection.query("INSERT INTO CCCA.ORDER (ORDER_ID, ACCOUNT_ID, MARKET_ID, SIDE, QUANTITY, PRICE, FILL_QUANTITY, FILL_PRICE, STATUS, TIMESTAMP) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [
            order.orderId, order.accountId, order.marketId, order.side, order.quantity, order.price, order.fillQuantity, order.fillPrice, order.status, order.timestamp]);
    }

    async update(order: Order): Promise<void> {
        await this.connection.query("UPDATE CCCA.ORDER SET STATUS = $1, FILL_QUANTITY = $2, FILL_PRICE = $3 WHERE ORDER_ID = $4", [
            order.status, order.fillQuantity, order.fillPrice, order.orderId]);
    }

    async getById(orderId: string): Promise<Order> {
        const [orderData] = await this.connection.query("SELECT * FROM CCCA.ORDER WHERE ORDER_ID = $1", [orderId]);
        if (!orderData) throw new Error("Order not found");
        return new Order(
            orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price),
            parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price), orderData.status, orderData.timestamp);
    }

    async getByMarketIdAndStatus(marketId: string, status: string): Promise<Order[]> {
        const ordersData = await this.connection.query("SELECT * FROM CCCA.ORDER WHERE MARKET_ID = $1 AND STATUS = $2", [marketId, status]);
        const orders: Order[] = [];
        for (const orderData of ordersData){
            const order = new Order(
            orderData.order_id, orderData.account_id, orderData.market_id, orderData.side, parseFloat(orderData.quantity), parseFloat(orderData.price),
            parseFloat(orderData.fill_quantity), parseFloat(orderData.fill_price), orderData.status, orderData.timestamp);
            orders.push(order);
        }
        return orders;
    }
}