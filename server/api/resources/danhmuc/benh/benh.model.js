import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const benhSchema = new Schema({
  benh: {
    type: String,
    required: true
  },
  thutu: {type: Number},
  is_deleted: {type: Boolean, default: false, select: false}
});
benhSchema.plugin(mongoosePaginate);
export default mongoose.model('Benh', benhSchema);
