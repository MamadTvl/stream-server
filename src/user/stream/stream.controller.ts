import {
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    NotFoundException,
    Body,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { AuthRequest } from 'src/common/middleware/authorization.middleware';
import { User } from 'src/schema/User.schema';
import { StreamDTO } from './stream.dto';
@Controller('/user/stream')
export class StreamController {
    constructor(private readonly streamService: StreamService) {}

    @Get(':name')
    async getStream(@Req() req: AuthRequest, @Param('name') name: string) {
        const stream = await this.streamService.findStream(
            req.user as User,
            name,
        );
        if (!stream) {
            throw new NotFoundException('Stream not found');
        }
        return {
            stream,
            url: await this.streamService.getRmtpUrl(stream),
            message: 'stream found',
        };
    }

    @Get()
    async getAllStreams(@Req() req: AuthRequest) {
        return {
            message: 'ok',
            streams: req.user.streams,
        };
    }

    @Post()
    async createStream(@Req() req: AuthRequest, @Body() body: StreamDTO) {
        const stream = await this.streamService.addStream(req.user, body);
        return {
            message: 'Create',
            stream,
        };
    }
}
