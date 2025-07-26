import pgp from "pg-promise";

//Porta de interface adapter
export default interface DataBaseConnection {
    query(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
}

//Framework and Driver - Implementação do adapter
export class PgPromiseAdapter implements DataBaseConnection {
    connection: any;
    constructor() {
        this.connection = pgp()("postgres://postgres:123456@db:5432/app");
    }

    async query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }
    async close(): Promise<void> {
        return await this.connection.$pool.end();
    }

}
