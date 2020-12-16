import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    permission: [],
    password: { type: String, required: true },
    gender: { type: String },
    avatar: { type: String },
    phone: { type: String, required: true },
    birthday: { type: Date },
    is_deleted: { type: Boolean, default: false, select: false },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

userSchema.plugin(mongoosePaginate);

export default mongoose.model("User", userSchema);
