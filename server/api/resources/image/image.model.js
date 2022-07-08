import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const ImageSchema = new Schema({
  img_name: String,
  img_originalname: String,
  img_uri: String,
  img_desc: String,
  img_path: String,
  img_destination: String,
  img_width: Number,
  img_height: Number,
  img_type: {type: String,
    enum: ['upload', 'capture'],
    default: 'upload'
  },
  datasetId: {type: mongoose.Schema.Types.ObjectId, ref: "Dataset"},
  dulieuId: {type: mongoose.Schema.Types.ObjectId, ref: "QuanlyDulieu"},
  labels: [{
    labelId:{type: mongoose.Schema.ObjectId, ref: 'Label'},
    xmax: Number,
    xmin: Number,
    ymax: Number,
    ymin: Number,
  }],
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'dmImage'
});
ImageSchema.plugin(mongoosePaginate);
export default mongoose.model('Image', ImageSchema);
