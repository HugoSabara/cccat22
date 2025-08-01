import AccountRepository from "../../infra/repository/AccountRepository";
import { inject } from "../../infra/di/Registry";
import OrderRepository from "../../infra/repository/OrderRepository";
import Order from "../../domain/Order";
import ExecuteOrder from "./ExecuteOrder";

export default class PlaceOrder {
    @inject("accountRepository")
    accountRepository!: AccountRepository;
    @inject("OrderRepository")
    orderRepository!: OrderRepository;

    async execute(input: Input): Promise<Output> {
      //TODO: IMPLEMENTAR A VERIFICAÇÃO DE SALDO
     //const account = await this.accountRepository.getById(input.accountId);
      const order = Order.create(input.accountId, input.marketId, input.side, input.quantity, input.price);
      await this.orderRepository.save(order);
      const executeOrder = new ExecuteOrder()
      executeOrder.execute(input.marketId);
      return {
        orderId: order.orderId
      }

    }
}

type Input = {
    accountId: string;
    marketId: string;
    side: string;
    quantity: number;
    price: number;
}   

type Output = {
    orderId: string;
}