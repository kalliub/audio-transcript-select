import { ApiConfig } from "./ApiConfig";

export class DecisionService extends ApiConfig {
  public async getDecisionsGroupedByEpisode() {
    try {
      const decisionRecords = await this.prisma.decision.findMany({
        orderBy: {
          segment_id: "asc",
        },
      });

      const groupedByEpisode = decisionRecords.reduce(
        (grouped: { [episode: number]: typeof decisionRecords }, decision) => {
          const key = decision.episode_id;
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

  public async getDecisionsByEpisode(episodeId: string) {
    try {
      const decisionRecords = await this.prisma.decision.findMany({
        where: {
          episode_id: parseInt(episodeId, 10),
        },
        orderBy: {
          segment_id: "asc",
        },
      });
      return decisionRecords;
    } catch (error) {
      console.error("Error getting decisions:", error);
      throw new Error("Error getting Decisions from the database: " + error);
    }
  }

  public async getDecision({
    episodeId,
    segmentId,
  }: {
    episodeId: string;
    segmentId: string;
  }) {
    try {
      const parsedEpisodeId = parseInt(episodeId, 10);
      const parsedSegmentId = parseInt(segmentId, 10);
      const decisionRecord = await this.prisma.decision.findUnique({
        where: {
          unique_decision_per_episode_segment: {
            episode_id: parsedEpisodeId,
            segment_id: parsedSegmentId,
          },
        },
      });

      return decisionRecord;
    } catch (error) {
      console.error("Error getting decision:", error);
      throw new Error("Error getting Decision from the database: " + error);
    }
  }

  public async upsertDecision({
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
      const decisionRecord = await this.prisma.decision.findUnique({
        where: {
          unique_decision_per_episode_segment: {
            episode_id: parsedEpisodeId,
            segment_id: parsedSegmentId,
          },
        },
      });

      if (decisionRecord) {
        // Update existing record by appending new decisions to the array
        const result = await this.prisma.decision.update({
          where: {
            unique_decision_per_episode_segment: {
              episode_id: parsedEpisodeId,
              segment_id: parsedSegmentId,
            },
          },
          data: {
            speakers,
          },
        });
        console.log("Decisions updated:", result);
        return result;
      } else {
        // Create a new record with the initial set of decisions
        const result = await this.prisma.decision.create({
          data: {
            episode_id: parsedEpisodeId,
            segment_id: parsedSegmentId,
            speakers,
          },
        });
        console.log("Decisions created:", result);
        return result;
      }
    } catch (error) {
      console.error("Error handling decision:", error);
      throw new Error("Error pushing Decision to the database: " + error);
    }
  }
}
