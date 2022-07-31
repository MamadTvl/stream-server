import { RTMPConfig, RTMPConfigDocument } from './../schema/Config.schema';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import NodeMediaServer from 'node-media-server';
import { Model } from 'mongoose';
import { Stream } from 'stream';
import { StreamDocument } from 'src/schema/Stream.schema';
@Injectable()
export class MediaServerService {
    private server: NodeMediaServer | undefined;
    private activeServerName: string | undefined;
    private logger: Logger = new Logger('MediaServerService');
    constructor(
        @InjectModel(RTMPConfig.name)
        public rtmpConfigModel: Model<RTMPConfigDocument>,
        @InjectModel(Stream.name)
        public streamModel: Model<StreamDocument>,
    ) {}

    static getStreamKeyFromStreamPath(path: string): string {
        const parts = path.split('/');
        return parts.at(-1);
    }

    private bindEvent() {
        this.server.on('preConnect', (id, args) => {
            this.logger.log(
                `preConnect:  id=${id} args=${JSON.stringify(args)}`,
            );
        });
        this.server.on('prePublish', async (id, StreamPath, args) => {
            this.logger.log(
                `prePublish: id=${id} StreamPath=${StreamPath} args=${JSON.stringify(
                    args,
                )}`,
            );
            const streamKey =
                MediaServerService.getStreamKeyFromStreamPath(StreamPath);
            const stream = await this.streamModel.findOne({ key: streamKey });
            if (!stream) {
                const session = this.server.getSession(id);
                // bug that should be fixed by them
                // @ts-ignore
                session.reject();
            }
        });
    }

    public async listen(name?: string | undefined) {
        if (this.server) {
            throw new BadRequestException('Server already running!');
        }
        const config: RTMPConfig = await this.rtmpConfigModel.findOne({
            ...(name ? { name: name } : { default: true }),
        });
        // TODO: what if config is null
        this.activeServerName = config.name;
        await this.rtmpConfigModel.updateOne(
            {
                ...(name ? { name: name } : { default: true }),
            },
            {
                $set: {
                    active: true,
                },
            },
        );
        this.server = new NodeMediaServer(config.rtmp_server);
        this.bindEvent();
        this.server.run();
    }

    public async close() {
        if (!this.server) {
            throw new BadRequestException('Server is not listening');
        }
        await this.rtmpConfigModel.updateOne(
            {
                name: this.activeServerName,
            },
            {
                $set: {
                    active: false,
                },
            },
        );
        this.server.stop();
        this.server = null;
    }
}
