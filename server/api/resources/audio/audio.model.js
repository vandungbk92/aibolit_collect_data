import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const AudioSchema = new Schema({
  audio_name: String,
  audio_originalname: String,
  audio_desc: String,
  audio_uri: String,
  audio_path: String,
  datasetId: {type: mongoose.Schema.Types.ObjectId, ref: "Dataset"},
  dulieuId: {type: mongoose.Schema.Types.ObjectId, ref: "QuanlyDulieu"},
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'Audio'
});
AudioSchema.plugin(mongoosePaginate);
export default mongoose.model('Audio', AudioSchema);
