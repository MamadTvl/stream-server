import { StreamDocument } from './../schema/Stream.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stream } from 'src/schema/Stream.schema';
import moment from 'moment';

@Injectable()
export class StreamService {
    constructor(
        @InjectModel(Stream.name) public streamModel: Model<StreamDocument>,
    ) {}

    public async findAllPublicStreams(): Promise<StreamDocument[]> {
        return await this.streamModel.find({
            public: true,
            expireDate: { $gte: moment().unix() },
        });
    }

    public async findStream(name: string): Promise<StreamDocument | null> {
        return await this.streamModel.findOne({
            public: true,
            expireDate: { $gte: moment().unix() },
            name: name,
        });
    }
}
