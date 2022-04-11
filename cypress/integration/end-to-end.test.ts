import { APP_CONTAINER } from "../selectors/selectors.cy";

describe("todos app", () => {
  it("loads app correctly", () => {
    // go to app
    cy.visit("/");

    // assert that the app loaded
    cy.get(APP_CONTAINER).should("be.visible");
  });

  it.skip("should create todo, mark it as done, and delete it correctly", () => {
    // TODO
  });
});
