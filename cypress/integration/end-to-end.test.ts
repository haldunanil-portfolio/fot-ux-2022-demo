describe("todos app", () => {
  it("loads app correctly", () => {
    // go to app
    cy.visit("/");

    // assert that the app loaded
    cy.get(".App").should("be.visible");
  });

  it.skip("should create todo, mark it as done, and delete it correctly", () => {
    // TODO
  });
});
