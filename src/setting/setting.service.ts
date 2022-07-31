import { MediaServerService } from './../media-server/media-server.service';
import { RTMPConfig, RTMPConfigDocument } from './../schema/Config.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RTMPConfigDTO } from './setting.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SettingService {
    constructor(
        @InjectModel(RTMPConfig.name)
        public configModel: Model<RTMPConfigDocument>,
        public mediaServer: MediaServerService,
    ) {}

    async findRtmpConfig(name?: string | undefined) {
        return await this.configModel.findOne({
            ...(name ? { name: name } : { default: true }),
        });
    }

    async addRtmpConfig(data: RTMPConfigDTO) {
        if ((await this.configModel.count({ name: data.name })) > 0) {
            throw new BadRequestException(`config ${data.name} already exists`);
        }
        const config = new this.configModel({
            name: data.name,
            rtmp_server: {
                rtmp: {
                    ...data.rtmp_server.rtmp,
                    port: process.env.RTMP_PORT,
                },
                http: {
                    ...data.rtmp_server.http,
                    media: './media',
                    port: process.env.HTTP_PORT,
                },
                auth: {
                    ...data.rtmp_server.auth,
                    secret: uuidv4(),
                },
                trans: {
                    ffmpeg: process.env.FFMPEG,
                    tasks: data.rtmp_server.trans.tasks,
                },
            },
            default: data.name,
        });
        await this.configModel.create(config);
    }
}
