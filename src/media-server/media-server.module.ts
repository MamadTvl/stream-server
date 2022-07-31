import { StreamSchema } from './../schema/Stream.schema';
import { RTMPConfig, RTMPConfigSchema } from './../schema/Config.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MediaServerService } from './media-server.service';
import { Stream } from 'src/schema/Stream.schema';

@Module({
    providers: [MediaServerService],
    imports: [
        MongooseModule.forFeature([
            {
                name: RTMPConfig.name,
                schema: RTMPConfigSchema,
            },
            {
                name: Stream.name,
                schema: StreamSchema,
            },
        ]),
    ],
    exports: [MediaServerService],
})
export class MediaServerModule {}
