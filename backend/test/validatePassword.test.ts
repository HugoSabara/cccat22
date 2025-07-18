import { validatePassword } from "../src/validatePassword";

test.each([
    "asdQWE123",
])("Deve validar um password válido: %s", (password: string) => {
    const isValid = validatePassword (password);
    expect(isValid).toBe(true);
});

test.each([
    "asdQWE",
    "asdaaa1123",
    "ASDWQUJ12",
    "ASDWQUJAQE",
])("Deve testar um password inválido: %s", (password: any) => {
    const isValid = validatePassword(password);
    expect(isValid).toBe(false);
});
