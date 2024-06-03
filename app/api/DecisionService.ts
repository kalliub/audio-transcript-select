import Decision from "schemas/Decision";
import { ApiConfig } from "./ApiConfig";

export class DecisionService extends ApiConfig {
  /** Gets all Decisions, grouped by episode
   * @returns An object with episode IDs as keys and an array of Decisions as values
   */
  static async getDecisionsGroupedByEpisode(): Promise<{
    [episode: number]: Decision[];
  }> {
    try {
      const decisionRecords = await Decision.find().sort({
        segmentId: "asc",
      });

      const groupedByEpisode = decisionRecords.reduce(
        (grouped: { [episode: number]: typeof decisionRecords }, decision) => {
          const key = decision.episodeId;
          if (!grouped[key]) {
            grouped[key] = [];
          }
          grouped[key].push(decision);
          return grouped;
        },
        {},
      );

      return groupedByEpisode;
    } catch (error) {
      console.error("Error getting decisions:", error);
      throw new Error("Error getting Decisions from the database: " + error);
    }
  }

  /** Gets all Decisions for a given episode */
  static async getDecisionsByEpisode(episodeId: string): Promise<Decision[]> {
    try {
      const decisionRecords = await Decision.find({
        episodeId: parseInt(episodeId, 10),
      }).sort({
        segmentId: "asc",
      });

      return decisionRecords;
    } catch (error) {
      console.error("Error getting decisions:", error);
      throw new Error("Error getting Decisions from the database: " + error);
    }
  }

  /** Gets a Decision by episode and segment ID */
  static async getDecision({
    episodeId,
    segmentId,
  }: {
    episodeId: string;
    segmentId: string;
  }): Promise<Decision | null> {
    try {
      const parsedEpisodeId = parseInt(episodeId, 10);
      const parsedSegmentId = parseInt(segmentId, 10);
      const decisionRecord = await Decision.findOne({
        episodeId: parsedEpisodeId,
        segmentId: parsedSegmentId,
      });

      return decisionRecord;
    } catch (error) {
      console.error("Error getting decision:", error);
      throw new Error("Error getting Decision from the database: " + error);
    }
  }

  /** Updates a given Decision. If it doesn't exists, creates one. */
  static async upsertDecision({
    episodeId,
    segmentId,
    speakers,
  }: {
    episodeId: string;
    segmentId: string;
    speakers: string[];
  }) {
    const parsedEpisodeId = parseInt(episodeId, 10);
    const parsedSegmentId = parseInt(segmentId, 10);

    try {
      const result = await Decision.findOneAndUpdate(
        {
          episodeId: parsedEpisodeId,
          segmentId: parsedSegmentId,
        },
        {
          speakers,
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        },
      );
      console.log("Decisions updated:", result);
      return result;
    } catch (error) {
      console.error("Error pushing decision:", error);
      throw new Error("Error pushing Decision to the database: " + error);
    }
  }
}
