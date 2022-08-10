import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { Stream, StreamSchema } from 'src/schema/Stream.schema';

@Module({
    controllers: [StreamController],
    providers: [StreamService],
    imports: [
        MongooseModule.forFeature([
            {
                name: Stream.name,
                schema: StreamSchema,
            },
        ]),
    ],
})
export class StreamModule {}
