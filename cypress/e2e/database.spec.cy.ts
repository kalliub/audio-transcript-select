import { Decision } from "@prisma/client";

describe("MongoDB and Prisma unit tests", () => {
  beforeEach(() => {
    cy.task("db:Decision:drop");
  });

  after(() => {
    cy.task("db:Decision:drop");
  });

  it("USE_TEST_DB environment variable is `true`", () => {
    expect(Cypress.env().USE_TEST_DB).to.equal("true");
  });

  it("Create a Decision on the Database", () => {
    cy.fixture<Decision>("decision.json").then((mockDecision) => {
      cy.task<Decision>("db:Decision", {
        operation: "create",
        decision: mockDecision,
      }).then((createdDecision) => {
        expect(createdDecision.speakers).to.include.members(
          mockDecision.speakers,
        );
        expect(createdDecision.segment_id).equal(mockDecision.segment_id);
        expect(createdDecision.episode_id).equal(mockDecision.episode_id);
      });
    });
  });

  it("Finds a unique Decision on the Database by it's episode and segment IDs", () => {
    cy.fixture<Decision>("decision.json").then((mockDecision) => {
      cy.task<Decision>("db:Decision", {
        operation: "create",
        decision: mockDecision,
      }).then((decision) => {
        cy.task<Decision>("db:Decision", {
          operation: "findUnique",
          decision: {
            episode_id: decision.episode_id,
            segment_id: decision.segment_id,
          },
        }).then((foundDecision) => {
          expect(foundDecision.segment_id).to.equal(decision.segment_id);
          expect(foundDecision.episode_id).to.equal(decision.episode_id);
          expect(foundDecision.speakers).to.include.members(decision.speakers);
        });
      });
    });
  });

  it("Updates a Decision on the Database", () => {
    const dummyTestSpeakers = ["1", "2", "3"];

    cy.fixture<Decision>("decision.json").then((mockDecision) => {
      cy.task<Decision>("db:Decision", {
        operation: "create",
        decision: mockDecision,
      }).then((decision) => {
        cy.task<Decision>("db:Decision", {
          operation: "update",
          decision: {
            episode_id: decision.episode_id,
            segment_id: decision.segment_id,
            speakers: dummyTestSpeakers,
          },
        }).then((updatedDecision) => {
          expect(updatedDecision.speakers).to.include.members(
            dummyTestSpeakers,
          );
        });
      });
    });
  });

  it("Blocks when trying to create a Decision with missing data", () => {
    cy.task<Error["message"]>("db:Decision", {
      operation: "create",
      decision: {},
    }).then((response) => {
      expect(response).to.include("Argument `segment_id` is missing");
    });
  });

  it("Blocks when trying to insert Decision with wrong data types", () => {
    cy.task<Error["message"]>("db:Decision", {
      operation: "create",
      decision: {
        segment_id: "1234",
        episode_id: "1234",
        speakers: 1,
      },
    }).then((response) => {
      expect(response).to.include("Invalid value provided");
    });
  });

  it("Blocks when a Decision is inserted with a duplicated segment", () => {
    cy.task("db:Decision:drop");
    cy.fixture<Decision>("decision.json").then((mockDecision) => {
      cy.task<Decision>("db:Decision", {
        operation: "create",
        decision: mockDecision,
      }).then((decision) => {
        expect(decision.segment_id).to.equal(mockDecision.segment_id);
      });

      cy.task<Error["message"]>("db:Decision", {
        operation: "create",
        decision: mockDecision,
      }).then((response) => {
        expect(response).to.include(
          "Unique constraint failed on the constraint: `Decision_segment_id_episode_id_key`",
        );
      });

      cy.task<Decision>("db:Decision", {
        operation: "create",
        decision: {
          ...mockDecision,
          segment_id: mockDecision.segment_id + 1,
        },
      }).then((decision) => {
        expect(decision.segment_id).to.equal(mockDecision.segment_id + 1);
      });
    });
  });
});
