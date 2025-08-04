import Email from "../../src/domain/Email";

test.each([
    "hugosabara@gmail.com",
])("Deve validar um email válido: %s", (email: string) => {
    expect(new Email(email)).toBeDefined();
});

test.each([
    "hugo.com",
    "hugo@",
    "hugo@gmail",
])("Deve testar um email inválido: %s", (email: any) => {
    expect(() => new Email(email)).toThrow(new Error("Invalid email"));
});
