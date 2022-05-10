import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const OximeterHistorySchema = new Schema({
  avgSpO2: {
    type: Number,
    required: true,
  },
  avgPulseRate: {
    type: Number,
    required: true,
  },
  avgPI: {
    type: Number,
    required: true,
  },
  minPI: {
    type: Number,
    required: true,
  }, maxPI: {
    type: Number,
    required: true,
  }, maxPulseRate: {
    type: Number,
    required: true,
  }, minPulseRate: {
    type: Number,
    required: true,
  }, totalTime: {
    type: Number,
    required: true,
  }, maxTimeRange: {
    type: Number,
    required: true,
  }, eachTime: {
    type: Array,
    required: true,
  },
  id_benhnhan: {
    type: String,
    required: true

  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

OximeterHistorySchema.plugin(mongoosePaginate);
export default mongoose.model('OximeterHistory', OximeterHistorySchema);

