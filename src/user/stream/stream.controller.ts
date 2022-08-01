import {
    Controller,
    Get,
    Param,
    Post,
    Req,
    NotFoundException,
    Body,
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { AuthRequest } from 'src/common/middleware/authorization.middleware';
import { User } from 'src/schema/User.schema';
import { StreamDTO } from './stream.dto';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
@ApiSecurity('authorization')
@ApiTags('user/stream')
@Controller('/user/stream')
export class StreamController {
    constructor(private readonly streamService: StreamService) {}
    @ApiOperation({ summary: 'find stream details to start' })
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
            message: 'stream found',
            stream,
            url: await this.streamService.getRmtpUrl(),
            streamKey: `${stream.key}?token=<YOUR_ACCESS_TOKEN>`,
        };
    }
    @ApiOperation({ summary: 'find my streams' })
    @Get()
    async getAllStreams(@Req() req: AuthRequest) {
        return {
            message: 'ok',
            streams: req.user.streams,
        };
    }
    @ApiOperation({ summary: 'add new stream' })
    @Post()
    async createStream(@Req() req: AuthRequest, @Body() body: StreamDTO) {
        const stream = await this.streamService.addStream(req.user, body);
        return {
            message: 'Created',
            stream,
        };
    }
}
