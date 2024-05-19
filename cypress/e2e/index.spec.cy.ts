describe("First Page", () => {
  beforeEach(() => {
    cy.task("db:Decision:drop");
    cy.visit("/");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(50);
  });

  it("Renders Page", () => {
    cy.get("h1").contains("Episodes");
  });

  it("Input the episode number", () => {
    cy.get("#episode-number").clear();
    cy.get("#episode-number").type("2");
  });

  it("Downloads all Episodes data", () => {
    cy.task("db:Decision", {
      operation: "create",
      decision: {
        episode_id: 1,
        segment_id: 0,
        speakers: ["1", "2", "3"],
      },
    });
    cy.intercept({
      method: "GET",
      pathname: "/episodes/download",
      query: {
        _data: "routes/episodes.download",
      },
    }).as("download-episodes-button");

    cy.get("#download-episodes").click();
    cy.wait("@download-episodes-button");

    cy.readFile("cypress/downloads/all-segments.json", "utf8")
      .should("exist")
      .its("1")
      .should("be.an", "array");
  });

  it("Shows tooltip on download button", () => {
    cy.get("#download-episodes").trigger("mouseover");
    cy.get(".MuiTooltip-tooltip").should(
      "have.text",
      "Download JSON file with EVERY EPISODE submitted to the database",
    );
  });

  it("Blocks to input letters", () => {
    cy.get("#episode-number").should("have.attr", "type", "number");
    cy.get("#episode-number").clear();
    cy.get("#episode-number").type("a");
    cy.get("#episode-number").should("have.value", "");
  });

  it("Disables > Button if episode number is empty", () => {
    cy.get("#episode-number").clear();
    cy.get("#episode-number").should("be.empty");

    cy.get("fieldset[aria-hidden=true]").should(
      "have.css",
      "border-color",
      "rgb(211, 47, 47)",
    );

    cy.get("#goto-episode").should("be.disabled");
  });

  it("Goes to Episode", () => {
    cy.intercept({
      pathname: "/episode/1/segment/0",
      query: {
        _data: "routes/episode.$episodeId.segment.$segmentId",
      },
    }).as("get-episode-segment");

    cy.get("#goto-episode").click();
    cy.wait("@get-episode-segment");
  });

  it("Throws error if episode does not exist", () => {
    cy.intercept({
      pathname: "/episode/2/segment/0",
      query: {
        _data: "routes/episode.$episodeId",
      },
    }).as("get-inexistent-episode");

    cy.get("#episode-number").as("episode-input");
    cy.get("@episode-input").clear();
    cy.get("@episode-input").type("2");

    cy.get("#goto-episode").click();
    cy.wait("@get-inexistent-episode").then((interception) => {
      expect(interception.response?.statusCode).equal(500);
      expect(interception.response?.body.message).equal(
        "Episode file not found.",
      );
    });
  });
});
