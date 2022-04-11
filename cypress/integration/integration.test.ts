import { APP_CONTAINER } from "../selectors/selectors.cy";

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
    cy.get(APP_CONTAINER).should("be.visible");
  });

  it.skip("should handle failed todo create gracefully", () => {
    // TODO
  });

  it.skip("should handle failed todo delete gracefully", () => {
    // TODO
  });

  it.skip("should handle failed todo mark as done gracefully", () => {
    // TODO
  });
});
