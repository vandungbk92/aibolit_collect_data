import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const quanlydulieuSchema = new Schema({
  tendulieu: {type: String},
  nhanvien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  datasetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dataset',
  },
  hinhanh:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
  }],
  video: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
  }],
  audio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Audio',
  }],
  ghichu: {type: String},
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'quanlydulieu'
});
quanlydulieuSchema.plugin(mongoosePaginate);
export default mongoose.model('QuanlyDulieu', quanlydulieuSchema);
