import { faker } from "@faker-js/faker";
describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .wait(5000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:bug"]').should("be.visible");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type("Bug");
      cy.get('input[name="title"]').should("have.value", "Bug");

      // Type value to description input field

      cy.get(".ql-editor").wait(7000).type("My bug description");
      cy.get(".ql-editor").should("have.text", "My bug description");

      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");

      // Reload the page to be able to see recently created issue
      // Assert that successful message has dissappeared after the reload
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");

      cy.contains("Issue has been successfully created.").should("be.visible");
      cy.get('[data-testid="board-list:backlog"]').wait(8000).contains("Bug");
      // Assert that modal window is closed and successful message is visible
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");

      // Assert than only one list with name Backlog is visible and do steps inside of it
    });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    const words = faker.random.words({ min: 3, max: 5 }); // 'cool sticky Borders'

    const word = faker.random.word();

    cy.get('[data-testid="modal:issue-create"]')
      .wait(8000)
      .within(() => {
        // Type value to title input field
        // Order of filling in the fields is first description, then title on purpose
        // Otherwise filling title first sometimes doesn't work due to web page implementation
        cy.get('input[name="title"]').type(word);
        cy.get('input[name="title"]').should("have.value", word);

        // Type value to description input field
        cy.get(".ql-editor").wait(8000).type(words);
        cy.get(".ql-editor").should("have.text", words);

        // Select Baby Yoda from reporter dropdown
        cy.get('[data-testid="select:reporterId"]').click();
        cy.get('[data-testid="select-option:Baby Yoda"]').click();

        cy.get('[data-testid="select:priority"]').click();
        cy.get('[data-testid="select-option:Low"]').click();

        // Click on button "Create issue"
        cy.get('button[type="submit"]').click();
      });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]').type(word);
    cy.get('[data-testid="board-list:backlog"]').should("have.text", word);
  });

  it("Should validate title is required field if missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });

  it("Should create new issue using the random data plugin", () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      const words = faker.random.words({ min: 3, max: 5 }); // 'cool sticky Borders'

      const word = faker.random.word();

      cy.get('input[name="title"]').type(words);

      cy.get('input[name="title"]').wait(8000).should("have.value", words);

      cy.get(".ql-editor").type(words);

      cy.get(".ql-editor").should("have.text", words);

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();

      cy.get('button[type="submit"]').click();

      cy.reload();

      cy.contain("Issue has been successfully created.")
        .wait(50000)
        .should("be.visible");
    });
  });
});
