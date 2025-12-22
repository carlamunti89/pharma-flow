/// <reference types="cypress" />

describe("PharmaFlow - Suite de Validación E2E", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/medicamentos").as("getMeds");
    cy.intercept("POST", "**/api/medicamentos").as("saveMed");
    cy.visit("http://localhost:5173");
  });

  it("Debería completar el ciclo de vida: Login -> Añadir -> Buscar -> Eliminar", () => {
    cy.get('input[type="email"]').type("admin@pharmaflow.com");
    cy.get('input[type="password"]').type("admin123");
    cy.get("button").contains("Iniciar Sesión").click();
    cy.wait("@getMeds");

    const nombreMed = `TEST-SEARCH-${Date.now()}`;
    cy.get('input[placeholder="Nombre del fármaco..."]').type(nombreMed);
    cy.get('input[placeholder="000000"]').type("999999");
    cy.get('input[placeholder="A-1"]').type("L-1");
    cy.get('input[type="date"]').type("2026-05-20");
    cy.get('input[placeholder="0.00"]').first().clear().type("12.00");

    cy.get("button").contains("Añadir").click();
    cy.wait("@saveMed");
    cy.wait("@getMeds");

    cy.get('input[placeholder*="Buscar"]').clear().type(nombreMed);
    cy.contains("div", nombreMed, { timeout: 10000 }).should("be.visible"); // CAMBIO: 'td' por 'div' según tu InventoryList

    cy.on("window:confirm", () => true);
    cy.contains(nombreMed)
      .closest("tr")
      .find('button[title="Eliminar"]')
      .click();
    cy.contains(nombreMed).should("not.exist");
  });

  it("Debería validar los filtros de estado (FEFO) y persistencia de sesión", () => {
    cy.get('input[type="email"]').type("admin@pharmaflow.com");
    cy.get('input[type="password"]').type("admin123");
    cy.get("button").contains("Iniciar Sesión").click();
    cy.wait("@getMeds");

    cy.reload();
    cy.contains("Conectado como:").should("be.visible");

    const hoy = new Date();
    const fechaRiesgo = new Date(hoy);
    fechaRiesgo.setDate(hoy.getDate() + 10);
    const fechaIso = fechaRiesgo.toISOString().split("T")[0];
    const nombreRiesgo = `RIESGO-${Date.now()}`;

    cy.get('input[placeholder*="Nombre"]').type(nombreRiesgo);
    cy.get('input[placeholder="000000"]').type("000111");
    cy.get('input[placeholder="A-1"]').type("L-RIESGO");
    cy.get('input[type="date"]').type(fechaIso);
    cy.get('input[placeholder="0.00"]').first().clear().type("5.00");
    cy.get("button").contains("Añadir").click();
    cy.wait("@saveMed");
    cy.wait("@getMeds");

    cy.contains("button", "En Riesgo").click();
    cy.contains(nombreRiesgo).should("be.visible");
    cy.contains("button", "Caducados").click();
    cy.contains(nombreRiesgo).should("not.exist");

    cy.contains("button", "Todos").click();

    // --- CAMBIO ESTRICTAMENTE NECESARIO ---
    // Usamos el buscador para que el item aparezca en la página 1 y no falle por la paginación de 10
    cy.get('input[placeholder*="Buscar"]').clear().type(nombreRiesgo);
    // --------------------------------------

    cy.on("window:confirm", () => true);

    cy.contains(nombreRiesgo, { timeout: 10000 })
      .closest("tr")
      .find('button[title="Eliminar"]')
      .click();

    cy.contains(nombreRiesgo).should("not.exist");
  });

  it("Debería cerrar sesión correctamente", () => {
    cy.get('input[type="email"]').type("admin@pharmaflow.com");
    cy.get('input[type="password"]').type("admin123");
    cy.get("button").contains("Iniciar Sesión").click();
    cy.get('button[title="Cerrar Sesión"]').click();
    cy.get('input[type="email"]').should("be.visible");
  });
});
