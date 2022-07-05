import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const VideoSchema = new Schema({
  video_name: String,
  video_uri: String,
  video_width: Number,
  video_height: Number,
  datasetId: {type: mongoose.Schema.Types.ObjectId, ref: "DataSet"},
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'dmVideo'
});
VideoSchema.plugin(mongoosePaginate);
export default mongoose.model('Video', VideoSchema);
