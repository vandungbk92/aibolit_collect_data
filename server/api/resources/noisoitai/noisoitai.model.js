import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const noisoitaiSchema = new Schema({
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
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
noisoitaiSchema.plugin(mongoosePaginate);
export default mongoose.model('NoiSoiTai', noisoitaiSchema);
