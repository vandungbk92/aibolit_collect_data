import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const OximeterHistorySchema = new Schema({
  avgSpO2: Number, // tổng SP02/totalTime
  avgPulseRate: Number, // tổng Pulse/totalTime
  avgPI: Number, // tổng PI/totalTime

  totalTime: Number, // tổng thời gian đo (cộng vào với cũ)

  minPI: Number,
  maxPI: Number,
  minPulseRate: Number,
  maxPulseRate: Number,
  minOximeter: Number,
  maxOximeter: Number,
  oximeterMonitor: Number,


  totalTimeBelowThreshold: Number, // tổng thời gian dưới ngưỡng below threshold
  totalBelowThreshold: Number, // số lần dưới ngưỡng.
  avgTimeBelowThreshold: Number, // trung bình thời gian dưới ngưỡng = tổng thời gian dưới ngưỡng / số lần dưới ngưỡng.
  maxTimeRange: Number, // thời gian dưới ngưỡng dài nhất.
  measurementDate: Date,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  typeRecord: Number
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

OximeterHistorySchema.plugin(mongoosePaginate);
export default mongoose.model('OximeterHistory', OximeterHistorySchema);

