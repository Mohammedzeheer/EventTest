import mongoose from 'mongoose';

const PosterBackgroundSchema = new mongoose.Schema({
  poster: { type: String, default: "defaultPoster.jpg" },
  color: { type: String, default: "white", enum: ["white", "dark"] },
  public_id: { type: String, default: "defaultPublicId" }
});

const ResultPosterSchema = new mongoose.Schema({
  poster1: PosterBackgroundSchema,
  poster2: PosterBackgroundSchema,
  poster3: PosterBackgroundSchema
}, {
  timestamps: true
});

const ResultPoster = mongoose.models.ResultPoster || mongoose.model("ResultPoster", ResultPosterSchema);

export default ResultPoster;