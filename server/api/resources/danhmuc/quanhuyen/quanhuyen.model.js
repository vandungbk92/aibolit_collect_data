import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const quanhuyenSchema = new Schema({
  maqh: {
    type: String,
    required: true,
  },
  tenqh: {
    type: String,
    required: true
  },
  tinhthanh_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'TinhThanh'
  },
  is_deleted: {type: Boolean, default: false, select: false}
});
quanhuyenSchema.plugin(mongoosePaginate);
export default mongoose.model('QuanHuyen', quanhuyenSchema);
