import mongoose from 'mongoose';
import { Password } from '../services/password';
import { User } from './user.type';

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: User): UserDoc;
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document, User {}

const userSchema = new mongoose.Schema<User>(
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
      default: 'http://localhost:3000/images/profile-dummy.png'
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
