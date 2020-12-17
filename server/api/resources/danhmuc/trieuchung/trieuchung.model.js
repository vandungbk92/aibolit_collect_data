import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const trieuchungSchema = new Schema({
  trieuchung: {
    type: String,
    required: true
  },
  thutu: {type: Number},
  is_deleted: {type: Boolean, default: false, select: false}
});
trieuchungSchema.plugin(mongoosePaginate);
export default mongoose.model('TrieuChung', trieuchungSchema);
