import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Deve criar uma conta", async () => {
    // Given
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    // When
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    // Then
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
    expect(outputGetAccount.password).toBe(inputSignup.password);
});

test ("Não deve cadastrar uma conta com nome errado", async ()=>{
    const inputSignup = {
        name: "John",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    //expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid name");    
});

test ("Deve possuir um e-mail válido", async ()=>{
    const inputSignup = {
        name: "John Doe",
        email: "john.doegmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    //expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid email");

});
/*
test ("O email não deve existir no cadastro", async ()=>{
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
   // expect(responseSignup.status).toBe(409);
    expect(outputSignup.error).toBe("Email already exists");

});
*/
test("O documento deve ser válido", async ()=>{
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "974563215",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
   // expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid document");
});

test("A senha deve ter no mínimo 8 caracteres com letras minúsculas, maiúsculas e números", async ()=>{
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdqwe123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
   // expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid password");
});


test("Deve fazer um depósito", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 10
    }
    await axios.post("http://localhost:3000/deposit", inputDeposit);
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets[0].assetId).toBe("BTC");
    expect(outputGetAccount.assets[0].quantity).toBe(10);
});

/*

test("Deve fazer um saque", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 10
    }
    await axios.post("http://localhost:3000/deposit", inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 5
    }
    await axios.post("http://localhost:3000/withdraw", inputWithdraw);
    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets[0].assetId).toBe("BTC");
    expect(outputGetAccount.assets[0].quantity).toBe(5);
});

test("Não deve fazer um saque sem fundos", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 5
    }
    await axios.post("http://localhost:3000/deposit", inputDeposit);
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: "BTC",
        quantity: 10
    }
    const responseWithdraw = await axios.post("http://localhost:3000/withdraw", inputWithdraw);
    const outputWithdraw = responseWithdraw.data;
    expect(outputWithdraw.error).toBe("Insufficient funds");
});
*/
