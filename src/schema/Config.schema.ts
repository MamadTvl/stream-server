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
            chunk_size: 60000;
            gop_cache: true;
            ping: 60;
            ping_timeout: 30;
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
}

export const RTMPConfigSchema = SchemaFactory.createForClass(RTMPConfig);

export type RTMPConfigDocument = RTMPConfig & Document;
