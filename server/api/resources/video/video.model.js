import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const VideoSchema = new Schema({
  video_name: String,
  video_originalname: String,
  video_desc: String,
  video_uri: String,
  video_path: String,
  datasetId: {type: mongoose.Schema.Types.ObjectId, ref: "DataSet"},
  dulieuId: {type: mongoose.Schema.Types.ObjectId, ref: "QuanlyDulieu"},
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'Video'
});
VideoSchema.plugin(mongoosePaginate);
export default mongoose.model('Video', VideoSchema);
