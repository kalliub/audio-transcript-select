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

  it("Disables > Button if episode number is empty", () => {
    cy.get("#episode-number").clear();
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
});
