import mongoose, { Schema, Document } from "mongoose";

interface IDecision extends Document {
  speakers: string[];
  segment_id: number;
  episode_id: number;
}

const DecisionSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    speakers: { type: [String], required: true },
    segment_id: { type: Number, required: true },
    episode_id: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

DecisionSchema.index(
  { segment_id: 1, episode_id: 1 },
  { unique: true, name: "unique_decision_per_episode_segment" },
);

const Decision = mongoose.model<IDecision>("Decision", DecisionSchema);

export default Decision;
