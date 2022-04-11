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
    cy.visit("/");

    // assert that the app loaded
    cy.get(".App").should("be.visible");
  });

  it.skip("should create todo correctly", () => {
    // TODO
  });

  it.skip("should mark todo as done correctly", () => {
    // TODO
  });

  it.skip("should mark todo as pending correctly", () => {
    // TODO
  });

  it.skip("should delete todo correctly", () => {
    // TODO
  });
});
