import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  participantName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  team:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  class: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    type: String,
    trim: true
  },
  profilePhoto: {
    type: String
  },
  registrationDate: {
    type: Date,
    default: Date.now
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

participantSchema.index({ email: 1 });
participantSchema.index({ phone: 1 });
participantSchema.index({ participantName: 1 });
participantSchema.index({ institution: 1 });

const ParticipantModel = mongoose.models.Participant || mongoose.model('Participant', participantSchema);
export default ParticipantModel;