import crypto from "crypto";
import { AccountDAODatabase } from "../../src/infra/dao/AccountDAO";
import { PgPromiseAdapter } from "../../src/infra/database/DataBaseConnection";
import Registry from "../../src/infra/di/Registry";

test("Deve persitir uma conta", async () => {
    const connection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", connection);
    const accountDAO = new AccountDAODatabase();    
    const account = {
        accountId: crypto.randomUUID(),
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    await accountDAO.save(account);
    const savedAccount = await accountDAO.getById(account.accountId);
    expect(savedAccount.account_id).toBe(account.accountId);
    expect(savedAccount.name).toBe(account.name);
    expect(savedAccount.email).toBe(account.email);
    expect(savedAccount.document).toBe(account.document);
    expect(savedAccount.password).toBe(account.password);
    await connection.close();
});
