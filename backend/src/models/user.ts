import { model, Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { User } from './../../../models/user.model';

const userSchema = new Schema<User>({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
});

userSchema.plugin(mongooseUniqueValidator);

export const UserModel = model('User',userSchema);