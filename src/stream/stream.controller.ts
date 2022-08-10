import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StreamService } from './stream.service';

@ApiTags('stream')
@Controller('stream')
export class StreamController {
    constructor(private readonly streamService: StreamService) {}

    @ApiOperation({ summary: 'get all public streams' })
    @Get()
    async getAll() {
        return {
            message: 'Streams found',
            streams: await this.streamService.findAllPublicStreams(),
        };
    }

    @ApiOperation({ summary: 'get stream url' })
    @Get(':name')
    async getOne(@Param('name') name: string) {
        const stream = await this.streamService.findStream(name);
        if (!stream) {
            throw new NotFoundException();
        }
        return {
            message: 'Stream found',
            url: `${process.env.HTTP_BASE_URL}/live/${stream.key}/index.m3u8`,
        };
    }
}
