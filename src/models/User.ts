import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Message extends Document {
  message: string;
  insert_ts: Date;
  is_delete: boolean;
}

const MessageSchema: Schema<Message> = new Schema(
  {
    message: { type: String, required: true },
    insert_ts: { type: Date, default: Date.now },
    is_delete: { type: Boolean, default: false },
  },
  {
    timestamps: false,
  }
);

export interface User extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  is_delete: boolean;
  is_accepting_message: boolean;
  verify_code: string;
  is_verify: boolean;
  messages: Message[];
  actual_password: string;
  short_url:string
}

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
    },
    password: { type: String, required: true },
    is_delete: { type: Boolean, default: false },
    is_accepting_message: { type: Boolean, default: true },
    verify_code: { type: String, default: "" },
    is_verify: { type: Boolean, default: false },
    messages: [MessageSchema],
    actual_password: { type: String,default:null },
    short_url:{type:String,default:null}
  },
  {
    timestamps: true,
  }
);

const UserModel = (mongoose.models.User as mongoose.Model<User>)|| mongoose.model<User>("User",UserSchema)

export default UserModel