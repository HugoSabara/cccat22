import { sum } from "../src/sum";

test("Deve somar dois números", ()=>{
    const result = sum(2,2);
    expect(result).toBe(4);
});


/*
import axios from "axios";

test("Deve criar uma conta", async () =>{
    const input = {
        name:"",
        email:"",
        
    }
    axios.post("http://localhost:3000/signup", input);
});
*/