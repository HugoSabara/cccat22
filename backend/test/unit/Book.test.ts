import Order from "../../src/domain/Order";

test("Deve tear a execução de ordens de compra e venda", function (){
    const book = new Book("BTC-USD");
    book.insert(Order.create("John Doe", "","","", "")); 
});