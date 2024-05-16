describe("Episode Page", () => {
  beforeEach(() => {
    cy.visit("/episode/1/segment/0");
    cy.wait(50);
  });

  it("Renders page", () => {
    cy.get("h1").contains("Episode 1");
    cy.get("h3").contains(/# \d+ of \d+ segments/);
    cy.get("audio").should("exist");
    cy.get("span").contains(/Timestamp: \d+ ~ \d+/);
    cy.get("#segment-text").should("exist");
    cy.get("#speakers-input").should("exist");
  });

  it("Inputs speakers", () => {
    cy.get("#speakers-input").clear().type("1,2,3");
    cy.get("#speakers-input").should("have.value", "1,2,3");
  });

  it("Submits speakers", () => {
    cy.intercept({
      method: "POST",
    }).as("submit-speakers");

    cy.intercept({
      method: "GET",
      pathname: "/episode/1/segment/1",
      query: {
        _data: "routes/episode.$episodeId.segment.$segmentId",
      },
    }).as("next-episode-redirect");

    cy.get("#speakers-input").clear().type("1,2,3");
    cy.get("#submit-speakers").click();
    cy.wait("@submit-speakers");
    cy.wait("@next-episode-redirect");
  });

  it("Plays audio when starts", () => {
    cy.get("audio").should("not.have.prop", "paused", true);
  });

  it("Continues to play the audio track", () => {
    cy.get("audio").then(($audio) => {
      const audio = $audio.get(0);
      cy.wait(1500).then(() => {
        expect(audio.currentTime).to.be.greaterThan(1);
      });
    });
  });
});
