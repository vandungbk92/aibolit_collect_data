import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const quanlydulieuSchema = new Schema({
  tendulieu: {type: String},
  nhanvien_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  hinhanh:[],
  video: {},
  anhchupvideo: [],
  audio: {},
  type: "",
  ngayupload: { type: Date, },
  ghichu: {type: String},
  is_deleted: { type: Boolean, default: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'dmquanlydulieu'
});
quanlydulieuSchema.plugin(mongoosePaginate);
export default mongoose.model('QuanlyDulieu', quanlydulieuSchema);
