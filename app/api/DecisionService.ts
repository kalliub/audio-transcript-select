import { ApiService } from "./ApiService";

export class DecisionService extends ApiService {
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
