import { RTMPConfig, RTMPConfigDocument } from './../schema/Config.schema';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import NodeMediaServer from 'node-media-server';
import { Model } from 'mongoose';
import { Stream } from 'stream';
import { StreamDocument } from 'src/schema/Stream.schema';
import { User, UserDocument } from 'src/schema/User.schema';
import { createHash } from 'crypto';
import moment from 'moment';
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
        @InjectModel(User.name) public userModel: Model<UserDocument>,
    ) {}

    static getStreamKeyFromStreamPath(path: string): string {
        const parts = path.split('/');
        return parts.at(-1);
    }

    static getQueryParams(name: string, url: string): string | null {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    private reject(id: string): void {
        const session = this.server.getSession(id);
        // bug that should be fixed by them
        // @ts-ignore
        session.reject();
    }

    private bindEvent() {
        this.server.on('preConnect', (id, args) => {
            this.logger.log(
                `preConnect:  id=${id} args=${JSON.stringify(args)}`,
            );
        });
        this.server.on(
            'prePublish',
            async (id, StreamPath, args: { token: string }) => {
                this.logger.log(
                    `prePublish: id=${id} StreamPath=${StreamPath} args=${JSON.stringify(
                        args,
                    )}`,
                );
                const streamKey =
                    MediaServerService.getStreamKeyFromStreamPath(StreamPath);
                const token = args.token;
                if (!token) {
                    this.reject(id);
                    return;
                }
                const user = await this.userModel.findOne(
                    {
                        token: createHash('sha256').update(token).digest('hex'),
                    },
                    {},
                    {
                        populate: {
                            path: 'streams',
                        },
                    },
                );
                const stream = user?.streams.find(
                    (item) => item.key === streamKey,
                );
                const now = moment().unix();
                if (now > stream.expireDate) {
                    this.reject(id);
                }
                if (!stream) {
                    this.reject(id);
                }
            },
        );
    }

    public async listen(name?: string | undefined) {
        if (this.server) {
            throw new BadRequestException('Server already running!');
        }
        const config: RTMPConfig = await this.rtmpConfigModel.findOne({
            ...(name ? { name: name } : { default: true }),
        });
        if (!config) {
            throw new BadRequestException(`${name} does not exists`);
        }
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
