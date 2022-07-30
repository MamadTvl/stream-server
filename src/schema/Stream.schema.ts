import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import shortid from 'shortid';

@Schema({ timestamps: true })
export class Stream {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true })
    key: string;
    @Prop({ required: true, default: true })
    public: boolean;
    @Prop({ required: true })
    expireDate: number;
}

export const StreamSchema = SchemaFactory.createForClass(Stream);

StreamSchema.methods.generateStreamKey = () => {
    return shortid.generate();
};

export type StreamDocument = Stream & Document;
