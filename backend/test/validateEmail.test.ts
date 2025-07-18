import { validateEmail } from "../src/validateEmail";

test.each([
    "hugosabara@gmail.com",
])("Deve validar um email válido: %s", (email: string) => {
    const isValid = validateEmail(email);
    expect(isValid).toBe(true);
});

test.each([
    "hugo.com",
    "hugo@",
    "hugo@gmail",
])("Deve testar um email inválido: %s", (email: any) => {
    const isValid = validateEmail(email);
    expect(isValid).toBe(false);
});
