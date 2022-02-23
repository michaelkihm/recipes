import mongoose from 'mongoose';
import { UserEvent } from '@mickenhosrecipes/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface UserDoc extends mongoose.Document, UserEvent {
    version: number
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(id: string, attrs: UserEvent): UserDoc;
    findByEvent(event: { id: string, version: number }): Promise<UserDoc | null>;
}

const UserSchema = new mongoose.Schema({
        username: { type: String, required: true },
        email: { type: String, required: true },
        image: { type: String, required: true },
    },
    {
        toJSON: {
          transform(_doc, ret) {
            ret.id = ret._id;
            delete ret._id;
          },
        },
    }
);

UserSchema.set('versionKey', 'version');
UserSchema.plugin(updateIfCurrentPlugin);
UserSchema.pre('remove', async function(){

    const RecipeModel = mongoose.model('Recipe');
    await RecipeModel.deleteMany({ userId: this._id });
});

UserSchema.statics.build = (_id: string, attrs: UserEvent) => {
    return new UserModel({ ...attrs, _id });
};
UserSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return UserModel.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

const UserModel = mongoose.model<UserDoc, UserModel>('User', UserSchema);

export { UserModel };