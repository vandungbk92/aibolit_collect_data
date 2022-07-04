import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const AudioSchema = new Schema({
  audio_name: String,
  audio_uri: String,
  datasetId: {type: mongoose.Schema.Types.ObjectId, ref: "DataSet"},
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'dmAudio'
});
AudioSchema.plugin(mongoosePaginate);
export default mongoose.model('Audio', AudioSchema);
