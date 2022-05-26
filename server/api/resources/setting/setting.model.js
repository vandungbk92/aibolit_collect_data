import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const settingSchema = new Schema({
  oximeter_min: Number,
  oximeter_max: Number,
  oximeter_monitor: Number,

  pulse_max: Number,
  pulse_min: Number,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
settingSchema.plugin(mongoosePaginate);
export default mongoose.model('Setting', settingSchema);
