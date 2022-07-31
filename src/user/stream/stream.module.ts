import { RTMPConfigSchema } from 'src/schema/Config.schema';
import { StreamSchema } from 'src/schema/Stream.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { Stream } from 'src/schema/Stream.schema';
import { User, UserSchema } from 'src/schema/User.schema';
import { RTMPConfig } from 'src/schema/Config.schema';

@Module({
    controllers: [StreamController],
    providers: [StreamService],
    imports: [
        MongooseModule.forFeature([
            {
                name: Stream.name,
                schema: StreamSchema,
            },
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: RTMPConfig.name,
                schema: RTMPConfigSchema,
            },
        ]),
    ],
})
export class StreamModule {}
