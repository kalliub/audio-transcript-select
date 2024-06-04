import { getFakeDecision } from "cypress/fixtures/decision.faker";

describe("MongoDB unit tests", () => {
  beforeEach(() => {
    cy.task("db:Decision:drop");
    cy.wrap(getFakeDecision()).as("mockDecision");
  });

  after(() => {
    cy.task("db:Decision:drop");
  });

  context("Database testing requirements", () => {
    it("USE_TEST_DB environment variable is `true`", () => {
      expect(Cypress.env().USE_TEST_DB).to.equal("true");
    });
  });

  context("DB Model: Decision", () => {
    context("Happy Path", () => {
      it("Create a Decision on the Database", () => {
        cy.get<Decision>("@mockDecision").then((mockDecision) => {
          cy.task<Decision>("db:Decision", {
            operation: "create",
            decision: mockDecision,
          }).then((createdDecision) => {
            expect(createdDecision.speakers).to.include.members(
              mockDecision.speakers,
            );
            expect(createdDecision.segmentId).equal(mockDecision.segmentId);
            expect(createdDecision.episodeId).equal(mockDecision.episodeId);
          });
        });
      });

      it("Finds a unique Decision on the Database by it's episode and segment IDs", () => {
        cy.get<Decision>("@mockDecision").then((mockDecision) => {
          cy.task<Decision>("db:Decision", {
            operation: "create",
            decision: mockDecision,
          }).then((decision) => {
            cy.task<Decision>("db:Decision", {
              operation: "findUnique",
              decision: {
                episodeId: decision.episodeId,
                segmentId: decision.segmentId,
              },
            }).then((foundDecision) => {
              expect(foundDecision.segmentId).to.equal(decision.segmentId);
              expect(foundDecision.episodeId).to.equal(decision.episodeId);
              expect(foundDecision.speakers).to.include.members(
                decision.speakers,
              );
            });
          });
        });
      });

      it("Updates a Decision on the Database", () => {
        const newDecisionSpeakers = getFakeDecision().speakers;

        cy.get<Decision>("@mockDecision").then((mockDecision) => {
          cy.task<Decision>("db:Decision", {
            operation: "create",
            decision: mockDecision,
          }).then((decision) => {
            cy.task<Decision>("db:Decision", {
              operation: "update",
              decision: {
                episodeId: decision.episodeId,
                segmentId: decision.segmentId,
                speakers: newDecisionSpeakers,
              },
            }).then((updatedDecision) => {
              expect(updatedDecision.speakers).to.include.members(
                newDecisionSpeakers,
              );
            });
          });
        });
      });
    });

    context("Unhappy Path", () => {
      it("Blocks when trying to create a Decision with missing data", () => {
        cy.task<Error["message"]>("db:Decision", {
          operation: "create",
          decision: {},
        }).should("include", "Path `segmentId` is required.");
      });

      it("Blocks when trying to insert Decision with wrong data types", () => {
        cy.task<Error["message"]>("db:Decision", {
          operation: "create",
          decision: {
            segmentId: "1234",
            episodeId: "1234",
            speakers: "this should not work",
          },
        }).should(
          "include",
          "Validator failed for path `speakers` with value `this should not work`",
        );
      });

      it("Blocks when a Decision is inserted with a duplicated segment", () => {
        cy.task("db:Decision:drop");
        cy.get<Decision>("@mockDecision").then((mockDecision) => {
          cy.task<Decision>("db:Decision", {
            operation: "create",
            decision: mockDecision,
          })
            .its("segmentId")
            .should("equal", mockDecision.segmentId);

          cy.task<Error["message"]>("db:Decision", {
            operation: "create",
            decision: mockDecision,
          }).should("include", "unique_decision_per_episode_segment");

          cy.task<Decision>("db:Decision", {
            operation: "create",
            decision: {
              ...mockDecision,
              segmentId: mockDecision.segmentId + 1,
            },
          })
            .its("segmentId")
            .should("equal", mockDecision.segmentId + 1);
        });
      });
    });
  });
});
