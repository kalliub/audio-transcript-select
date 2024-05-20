describe("Episode Page", () => {
  beforeEach(() => {
    cy.task("db:Decision:drop");
    cy.visit("/episode/1/segment/0");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(50);
  });

  after(() => {
    cy.task("db:Decision:drop");
  });

  context("Rendering and Components", () => {
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
      cy.get("#speakers-input");
      cy.get("#speakers-input").clear();
      cy.get("#speakers-input").type("1,2,3");
      cy.get("#speakers-input").should("have.value", "1,2,3");
    });

    it("Automatically plays the audio track for more than 1 second", () => {
      cy.get("audio").then(($audio) => {
        const audio = $audio.get(0);
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1500).then(() => {
          expect(audio.currentTime).to.be.greaterThan(1);
        });
      });
    });
  });

  context("Forms and Navigation", () => {
    it("Submit speakers", () => {
      cy.intercept({
        method: "POST",
        // TODO: Include pathname
      }).as("submit-speakers");

      cy.intercept({
        method: "GET",
        pathname: "/episode/1/segment/1",
        query: {
          _data: "routes/episode.$episodeId.segment.$segmentId",
        },
      }).as("next-episode-redirect");

      cy.get("#speakers-input").as("speakers-input");
      cy.get("@speakers-input").clear();
      cy.get("@speakers-input").type("1,2,3");

      cy.get("#submit-speakers").click();
      cy.wait("@submit-speakers");
      cy.wait("@next-episode-redirect");
    });

    it("Navigates to `Check Episode` page", () => {
      cy.get("button#check-episode").as("check-episode-button");
      cy.get("@check-episode-button").should("be.visible");
      cy.get("@check-episode-button").should("have.text", "Check Episode");
      cy.get("@check-episode-button").click();
      cy.url().should("contain", "/episode/1/check");
    });
  });
});
