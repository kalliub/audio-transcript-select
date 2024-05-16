describe("Episode Page", () => {
  beforeEach(() => {
    cy.visit("/episode/1/segment/0");
    cy.wait(50);
  });

  it("Renders page", () => {
    cy.fixture("episodeData").then((episodeData) => {
      cy.get("h1").should("have.text", "Episode 1");
      cy.get("h3").contains(
        new RegExp(String.raw`# ${episodeData[0].id} of \d+ segments`),
      );
      cy.get("audio").should("exist");
      cy.get("#segment-timestamp").should(
        "have.text",
        `Timestamp: ${episodeData[0].start} ~ ${episodeData[0].end}`,
      );
      cy.get("#speakers-input").should("exist");
      cy.get("#segment-text").should("have.text", episodeData[0].text);
    });
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

  it("Check episode button", () => {
    const button = cy.get("button#check-episode");
    button.should("be.visible");
    button.should("have.text", "Check Episode");
    button.click();
    cy.url().should("contain", "/episode/1/check");
  });
});
