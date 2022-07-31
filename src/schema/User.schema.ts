import { Stream } from './Stream.schema';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import bcrypt from 'bcryptjs';

@Schema({ timestamps: true })
export class User {
    _id: MongooseSchema.Types.ObjectId;
    @Prop({ required: true, unique: true, index: true })
    username: string;
    @Prop({ required: true })
    password: string;
    @Prop({ default: null })
    token: string | null;
    @Prop({
        default: [],
        type: [{ type: MongooseSchema.Types.ObjectId, ref: Stream.name }],
    })
    streams: Stream[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
