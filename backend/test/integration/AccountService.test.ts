import { AccountDAODatabase, AccountDAOMemory } from "../../src/infra/dao/AccountDAO";
import sinon from "sinon";
import Registry from "../../src/infra/di/Registry";
import { AccountAssetDAODatabase } from "../../src/infra/dao/AccountAssetDAO";
import crypto from "crypto";
import DataBaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DataBaseConnection";
import AccountService from "../../src/application/service/AccountService";

let connection: DataBaseConnection
let accountService: AccountService;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    Registry.getInstance().provide("databaseConnection", connection);
    Registry.getInstance().provide("accountDAO", new AccountDAODatabase());
    Registry.getInstance().provide("accountAssetDAO", new AccountAssetDAODatabase());
    accountService = new AccountService();
});


test("Deve criar uma conta", async () => {
    // Given
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    // When
    const outputSignup = await accountService.signup(inputSignup);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(outputGetAccount.password).toBe(inputSignup.password);
});

test("Não deve criar uma conta se o nome for inválido", async () => {
    const inputSignup = {
        name: "John",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    await expect(() => accountService.signup(inputSignup)).rejects.toThrow("Invalid name");
});

test("Não deve criar uma conta se o e-mail for inválido", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doegmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    await expect(() => accountService.signup(inputSignup)).rejects.toThrow("Invalid email");
});
test("Não deve criar uma conta se o documento for inválido", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "974563215",
        password: "asdQWE123"
    }
    await expect(() => accountService.signup(inputSignup)).rejects.toThrow("Invalid document");
});

test("Não deve criar uma conta se a senha tiver menos de 8 caracteres", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdqwe"
    }
    await expect(() => accountService.signup(inputSignup)).rejects.toThrow("Invalid password");
});


test("Deve criar uma conta com stub", async () => {
    const saveStub = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }

    const getByIdStub = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(inputSignup);

    const outputSignup = await accountService.signup(inputSignup);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(outputGetAccount.password).toBe(inputSignup.password);
    saveStub.restore();
    getByIdStub.restore();
});

test("Deve criar uma conta com spy", async () => {
    const saveSpy = sinon.spy(AccountDAODatabase.prototype, "save");
    const getByIdSpy = sinon.spy(AccountDAODatabase.prototype, "getById");

    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }


    const outputSignup = await accountService.signup(inputSignup);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(outputGetAccount.password).toBe(inputSignup.password);

    expect(saveSpy.calledOnce).toBe(true);
    expect(getByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
    expect(getByIdSpy.calledOnce).toBe(true);
    saveSpy.restore();
    getByIdSpy.restore();

});

test("Deve criar uma conta com mock", async () => {
    const accountDAOMock = sinon.mock(AccountDAODatabase.prototype);
    accountDAOMock.expects("save").once().resolves();

    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }

    accountDAOMock.expects("getById").once().resolves(inputSignup);

    const outputSignup = await accountService.signup(inputSignup);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(outputGetAccount.password).toBe(inputSignup.password);
    accountDAOMock.verify();
    accountDAOMock.restore();
});

test("Deve criar uma conta com fake", async () => {
    const accountDAO = new AccountDAOMemory();
    Registry.getInstance().provide("accountDAO", accountDAO);
    accountService = new AccountService();
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(outputGetAccount.password).toBe(inputSignup.password);
});


test("Deve depositar em uma conta", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 1000
    }
    await accountService.deposit(inputDeposit);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.balances[0].asset_id).toBe("USD");
    expect(outputGetAccount.balances[0].quantity).toBe("1000");
});

test("Não deve depositar em uma conta que não existe", async () => {
    const inputDeposit = {
        accountId: crypto.randomUUID(),
        assetId: "USD",
        quantity: 1000
    }
    expect(() => accountService.deposit(inputDeposit)).rejects.toThrow(new Error("Account not found"));
});

test("Deve sacar de uma conta", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 1000
    }
    await accountService.deposit(inputDeposit);
        const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 500
    }
    await accountService.withdraw(inputWithdraw);
    const outputGetAccount = await accountService.getAccount(outputSignup.accountId);
    expect(outputGetAccount.balances[0].asset_id).toBe("USD");
    expect(outputGetAccount.balances[0].quantity).toBe("500");
});

test("Não deeve sacar de uma conta se não tiver saldo suficiente", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const outputSignup = await accountService.signup(inputSignup);
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 500
    }
    await accountService.deposit(inputDeposit);
        const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 1000
    }
    await expect(() => accountService.withdraw(inputWithdraw)).rejects.toThrow(new Error("Insufficient funds"));
   
});

afterEach(async () => {
    await connection.close();
});