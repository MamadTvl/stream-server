import { RTMPConfig, RTMPConfigSchema } from './../schema/Config.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MediaServerService } from './media-server.service';

@Module({
    providers: [MediaServerService],
    imports: [
        MongooseModule.forFeature([
            {
                name: RTMPConfig.name,
                schema: RTMPConfigSchema,
            },
        ]),
    ],
})
export class MediaServerModule {}
