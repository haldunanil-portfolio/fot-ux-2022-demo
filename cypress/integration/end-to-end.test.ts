describe("todos app", () => {
  it("loads app correctly", () => {
    // go to app
    cy.visit("http://localhost:3000");

    // assert that the app loaded
    cy.get(".App").should("be.visible");
  });

  it("should create todo, mark it as done, and delete it correctly", () => {
    // TODO
  });
});
