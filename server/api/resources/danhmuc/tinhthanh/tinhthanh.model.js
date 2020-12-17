import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const tinhthanhSchema = new Schema({
  matinh: {
    type: String,
    required: true,
  },
  tentinh: {
    type: String,
    required: true
  },
  is_deleted: {type: Boolean, default: false, select: false}
});
tinhthanhSchema.plugin(mongoosePaginate);
export default mongoose.model('TinhThanh', tinhthanhSchema);
