const mongoose = require("mongoose");

const TeamPointSchema = new mongoose.Schema({
  results: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
      },
      point: {
        type: Number,
        default: 0
      }
    }
  ],
  afterCount: {
    type: Number,
    default: 0,
    required: true
  }
}, {
  timestamps: true
});

const TeamPointModel = mongoose.models.TeamPoint || mongoose.model('TeamPoint', TeamPointSchema);
export default TeamPointModel;