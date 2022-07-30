import { Stream } from './Stream.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import bcrypt from 'bcryptjs';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ default: null })
    token: string | null;
    @Prop({
        default: null,
        ref: () => Stream,
        type: MongooseSchema.Types.ObjectId,
    })
    stream: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.generateHash = (str: string) => {
    return bcrypt.hashSync(str, bcrypt.genSaltSync(8));
};
UserSchema.methods.validPassword = function (password: string) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.validToken = function (token: string) {
    return bcrypt.compareSync(token, this.token);
};
export type UserDocument = User & Document;
