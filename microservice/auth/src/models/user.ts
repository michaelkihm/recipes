import { User } from '@mickenhosrecipes/common';
import mongoose from 'mongoose';
import { Password } from '../services/password';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: User): UserDoc;
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document, User {
  version: number
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false,
      default: '/api/users/images/profile-dummy.jpg'
    },
    username: {
      type: String,
      required: true,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: User) => {
  return new UserModel(attrs);
};

const UserModel = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { UserModel };
