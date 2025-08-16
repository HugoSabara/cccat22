import Name from "../../src/domain/Name";

test.each([
    "Hugo Henrique",
    "Hugo Henrique Ramos",
    "Hugo Henrique Ramos Sabará"
])("Deve validar um nome válido: %s", (name: string) => {
    expect(new Name(name)).toBeDefined();
});

test.each([
    "Hugo",
    "",
])("Deve testar um nome inválido: %s", (name: any) => {
    expect(() => new Name(name)).toThrow(new Error("Invalid name"));
});
