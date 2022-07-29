import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import shortid from 'shortid';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, index: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ required: true })
    token: string;
    @Prop()
    streamKey: string;
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

UserSchema.methods.generateStreamKey = () => {
    return shortid.generate();
};
export type UserDocument = User & Document;
