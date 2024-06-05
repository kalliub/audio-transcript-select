import mongoose, { Schema } from "mongoose";

const DecisionSchema = new Schema(
  {
    speakers: {
      type: [String],
      required: true,
      validate: (speakersInput: string[]) => {
        // Ensure each element matches the format "1", "2", "3", ...
        return speakersInput.every((speaker) => /^\d+$/.test(speaker));
      },
    },
    segmentId: { type: Number, required: true },
    episodeId: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    autoCreate: true,
  },
);

DecisionSchema.index(
  { segmentId: 1, episodeId: 1 },
  { unique: true, name: "unique_decision_per_episode_segment" },
);

const Decision = mongoose.model<Decision>("Decision", DecisionSchema);
Decision.createIndexes();
Decision.createCollection();

export default Decision;
