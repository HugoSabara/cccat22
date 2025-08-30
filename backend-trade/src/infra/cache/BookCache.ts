import Book from "../../domain/Book";

export default class BookCache {
    private books: { [marketId: string]: Book } = {};

    getOrCreate (marketId: string) {
        if (!this.books[marketId]) {
            this.books[marketId] = new Book(marketId);
        }
        return this.books[marketId];
    }

}