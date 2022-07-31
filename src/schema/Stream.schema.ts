import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

export type StreamDocument = Stream & Document;
