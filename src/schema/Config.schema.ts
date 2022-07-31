import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RTMPConfig {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, type: 'object' })
    rtmp_server: {
        rtmp: {
            port: number;
            chunk_size: number;
            gop_cache: true;
            ping: number;
            ping_timeout: number;
        };
        http: {
            port: number;
            mediaroot: string;
            allow_origin: '*';
        };
        auth: {
            play: true;
            publish: true;
            secret: string;
        };
        trans: {
            ffmpeg: string;
            tasks: [
                {
                    app: string;
                    hls: true;
                    hlsFlags: string;
                },
            ];
        };
    };
    @Prop({ required: true, default: true })
    default: boolean;
    @Prop({ default: false })
    active: boolean;
}

export const RTMPConfigSchema = SchemaFactory.createForClass(RTMPConfig);

export type RTMPConfigDocument = RTMPConfig & Document;
