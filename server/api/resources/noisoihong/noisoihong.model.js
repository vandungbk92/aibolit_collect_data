import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const noisoihongSchema = new Schema({
  makham: {
    type: String
  },
  tuoi: {
    type: Number
  },
  namsinh: {
    type: Number
  },
  gioitinh: {
    type: String
  },
  tinhthanh_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TinhThanh',
  },
  quanhuyen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuanHuyen',
  },
  phuongxa_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PhuongXa',
  },

  trieuchung_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrieuChung',
  }],
  lydokham: {type: String},

  hinhanh: [],
  video: [],

  ketluan: {
    type: String
  },
  hinhanhkq: [],
  benh_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Benh',
  }],
  is_deleted: {type: Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
noisoihongSchema.plugin(mongoosePaginate);
export default mongoose.model('NoiSoiHong', noisoihongSchema);
