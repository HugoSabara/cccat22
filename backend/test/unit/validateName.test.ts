import { validateName } from "../../src/domain/validateName";

test.each([
    "Hugo Henrique",
    "Hugo Henrique Ramos",
    "Hugo Henrique Ramos Sabará"
])("Deve validar um nome válido: %s", (name: string) => {
    const isValid = validateName(name);
    expect(isValid).toBe(true);
});

test.each([
    "Hugo",
    "",
])("Deve testar um nome inválido: %s", (name: any) => {
    const isValid = validateName(name);
    expect(isValid).toBe(false);
});
