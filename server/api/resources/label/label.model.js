import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;
const LabelSchema = new Schema({
  labelName: String,
  description : String,
  totalLabel: Number,
  datasetId: { type: mongoose.Schema.Types.ObjectId, ref: "DataSet", required: true},
  is_deleted: { type: Boolean, default: false, select: false },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  collection: 'dmLabel'
});
LabelSchema.plugin(mongoosePaginate);
export default mongoose.model('Label', LabelSchema);
