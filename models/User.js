// models/user.js
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email:   { type: String, unique: true, required: true },
  username:{ type: String, required: false },
  name:    { type: String },
  role:    { type: String, default: "customer" }, // default to customer
  image:   { type: String },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
