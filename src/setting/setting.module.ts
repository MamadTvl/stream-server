import { MediaServerModule } from './../media-server/media-server.module';
import { RTMPConfig, RTMPConfigSchema } from './../schema/Config.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

@Module({
    controllers: [SettingController],
    providers: [SettingService],
    imports: [
        MongooseModule.forFeature([
            {
                name: RTMPConfig.name,
                schema: RTMPConfigSchema,
            },
        ]),
        MediaServerModule,
    ],
})
export class SettingModule {}
