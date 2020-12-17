import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const phuongxaSchema = new Schema({
  quanhuyen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuanHuyen',
    required: true,
  },
  tinhthanh_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TinhThanh',
    required: true,
  },
  maphuongxa: {
    type: String,
    required: true
  },
  tenphuongxa: {
    type: String,
    required: true
  },
  is_deleted: {type: Boolean, default: false, select: false}
});
phuongxaSchema.plugin(mongoosePaginate);
export default mongoose.model('PhuongXa', phuongxaSchema);
