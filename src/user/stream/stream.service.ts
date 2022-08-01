import { RTMPConfig, RTMPConfigDocument } from 'src/schema/Config.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stream, StreamDocument } from 'src/schema/Stream.schema';
import { User, UserDocument } from 'src/schema/User.schema';
import md5 from 'md5';
import { StreamDTO } from './stream.dto';
import shortid from 'shortid';
@Injectable()
export class StreamService {
    constructor(
        @InjectModel(Stream.name) public streamModel: Model<StreamDocument>,
        @InjectModel(User.name) public userModel: Model<UserDocument>,
        @InjectModel(RTMPConfig.name)
        public configModel: Model<RTMPConfigDocument>,
    ) {}

    public async findStream(
        user: User,
        streamName: string,
    ): Promise<Stream | undefined> {
        return user.streams.find((item) => item.name === streamName);
    }

    public async getRmtpUrl() {
        const config = await this.configModel.findOne({
            active: true,
        });
        if (!config) {
            throw new BadRequestException('Cannot found active rmtp server');
        }
        const appName = config.rtmp_server.trans.tasks[0].app;
        return `rtmp://${process.env.RMTP_BASE_URL}/${appName}`;
    }

    public async addStream(user: User, data: StreamDTO) {
        if ((await this.streamModel.count({ name: data.name })) > 0) {
            throw new BadRequestException(
                `duplicate name is not valid [got: "${data.name}"]`,
            );
        }
        const stream = new this.streamModel({
            name: data.name,
            expireDate: data.expireDate,
            key: shortid(),
            public: true,
        });
        await this.streamModel.create(stream);
        await this.userModel.updateOne(
            {
                _id: user._id,
            },
            {
                $push: {
                    streams: stream._id,
                },
            },
        );
        return stream;
    }
}
