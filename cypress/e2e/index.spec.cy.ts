describe("First Page", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(50);
  });

  it("Renders Page", () => {
    cy.get("h1").contains("Episodes");
  });

  it("Input the episode number", () => {
    cy.get("#episode-number").clear().type("2");
  });

  it("Downloads all Episodes data", () => {
    cy.intercept({
      method: "GET",
      pathname: "/episodes/download",
      query: {
        _data: "routes/episodes.download",
      },
    }).as("download-episodes-button");

    cy.get("#download-episodes").click();
    cy.wait("@download-episodes-button");

    const downloadedFile = cy
      .readFile("cypress/downloads/all-segments.json", "utf8")
      .should("exist");

    downloadedFile.its("1").should("be.an", "array");
  });

  it("Shows tooltip on download button", () => {
    cy.get("#download-episodes").trigger("mouseover");
    cy.get(".MuiTooltip-tooltip").should(
      "have.text",
      "Download JSON file with EVERY EPISODE submitted to the database",
    );
  });

  it("Blocks to input letters", () => {
    const episodeNumberInput = cy.get("#episode-number");
    episodeNumberInput.should("have.attr", "type", "number");
    episodeNumberInput.clear().type("a").should("have.value", "");
  });

  it("Disables > Button if episode number is empty", () => {
    const episodeNumberInput = cy.get("#episode-number");
    episodeNumberInput.clear().should("be.empty");
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

    cy.get("#episode-number").clear().type("2");
    cy.get("#goto-episode").click();
    cy.wait("@get-inexistent-episode").then((interception) => {
      expect(interception.response?.statusCode).equal(500);
      expect(interception.response?.body.message).equal(
        "Episode file not found.",
      );
    });
  });
});
