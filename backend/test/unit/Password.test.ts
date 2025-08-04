import Password from "../../src/domain/Password";

test.each([
    "asdQWE123",
])("Deve validar um password válido: %s", (password: string) => {
    expect(new Password(password)).toBeDefined();
});

test.each([
    "asdQWE",
    "asdaaa1123",
    "ASDWQUJ12",
    "ASDWQUJAQE",
])("Deve testar um password inválido: %s", (password: any) => {
   expect(() => new Password(password)).toThrow(new Error("Invalid password"))
});
