describe("todos app", () => {
  beforeEach(() => {
    const BASE_URL = Cypress.env("base_url");

    // intercept fetch request for the list of todos
    cy.intercept("GET", `${BASE_URL}/todos`, {
      fixture: "todos.json",
    });
  });

  it("loads app correctly", () => {
    // go to app
    cy.visit("http://localhost:3000");

    // assert that the app loaded
    cy.get(".App").should("be.visible");
  });

  it("should create todo correctly", () => {
    // TODO
  });

  it("should mark todo as done correctly", () => {
    // TODO
  });

  it("should mark todo as pending correctly", () => {
    // TODO
  });

  it("should delete todo correctly", () => {
    // TODO
  });
});
