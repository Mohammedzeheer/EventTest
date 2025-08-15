import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

teamSchema.index({ teamName: 1 });
teamSchema.index({ isDeleted: 1 });
teamSchema.index({ isActive: 1 });

const TeamModel = mongoose.models.Team || mongoose.model('Team', teamSchema);

export default TeamModel;