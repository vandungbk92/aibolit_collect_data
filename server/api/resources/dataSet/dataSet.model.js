import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const dataSetSchema = new Schema({
  dataset_name: {type: String},
  dataset_status: {type: Boolean, default: true}, // là Đồng bộ hoặc

  description: {type: String},
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image"}],
  video: [{type: mongoose.Schema.Types.ObjectId, ref: "Video"}],
  audio: [{type: mongoose.Schema.Types.ObjectId, ref: "Audio"}],
  label_cate: [{type: mongoose.Schema.Types.ObjectId, ref: "Label"}],
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'dmdataSet'
});
dataSetSchema.plugin(mongoosePaginate);
export default mongoose.model('DataSet', dataSetSchema);
