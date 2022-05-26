import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const SpO2Schema = new Schema(
  {
    oxigenSaturation: Number,
    pulseRate: Number,
    perfussionIndex: Number,
    time: Date,

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    oximeter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OximeterHistory',
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
SpO2Schema.index({ user_id: 1  });
SpO2Schema.index({ time: 1  });
SpO2Schema.index({ oximeter_id: 1  });
SpO2Schema.plugin(mongoosePaginate);
export default mongoose.model("SpO2", SpO2Schema);
