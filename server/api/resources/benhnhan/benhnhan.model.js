import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const benhnhanSchema = new Schema({
  mabn: {
    type: String,
    required: true
  },
  hoten: {
    type: String,
    required: true,
  },
  tuoi: {
    type: Number,
    required: true,
  },
  gioitinh: {
    type: String,
    required: true,
  },
  is_deleted: { type: Boolean, default: false, select: false },
});
benhnhanSchema.plugin(mongoosePaginate);
export default mongoose.model('BenhNhan', benhnhanSchema);
