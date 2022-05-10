import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const {Schema} = mongoose;

const SpO2Schema = new Schema({
  oxigenSaturation: {
    type: Number,
    required: true
  },
  pulseRate: {
    type:  Number,
    required: true
  },
  perfussionIndex: {
    type: Number,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
})

SpO2Schema.plugin(mongoosePaginate);
export default mongoose.model('SpO2', SpO2Schema);

