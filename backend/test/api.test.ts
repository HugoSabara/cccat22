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
    expect(responseSignup.status).toBe(422);
    const outputSignup = responseSignup.data;
    expect(outputSignup.message).toBe("Invalid name");    
});


