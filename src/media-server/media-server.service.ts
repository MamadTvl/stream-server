import { RTMPConfig, RTMPConfigDocument } from './../schema/Config.schema';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import NodeMediaServer from 'node-media-server';
import { Model } from 'mongoose';
@Injectable()
export class MediaServerService {
    private server: NodeMediaServer | undefined;
    constructor(
        @InjectModel(RTMPConfig.name)
        public rtmpConfigModel: Model<RTMPConfigDocument>,
    ) {}

    public listen() {
        if (this.server) {
            throw new BadRequestException('Server already running!');
        }
        this.init();
    }

    public close() {
        this.server.stop();
        this.server = null;
    }

    public bindEvent() {
        // this.server.on('', () => {});
    }

    private async init() {
        const config: RTMPConfig = await this.rtmpConfigModel.findOne({
            default: true,
        });
        this.server = new NodeMediaServer(config.rtmp_server);
        this.bindEvent();
        this.server.run();
    }
}
