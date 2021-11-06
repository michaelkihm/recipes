import { model, Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { User } from './../../../models/user.model';

const userSchema = new Schema<User>({
   email: { type: String, required: true, unique: true },
   username: { type: String, required: true },
   password: { type: String, required: true },
   bookmarks: { type: [String], required: true, default: [] },
   image: { type: String, required: false, default: 'http://localhost:4000/images/profile-dummy.png' }
});

userSchema.plugin(mongooseUniqueValidator);

export const UserModel = model('User',userSchema);