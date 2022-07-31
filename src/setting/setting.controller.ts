import { RTMPConfigDTO, RTMPActionDTO, RTMPAction } from './setting.dto';
import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    BadRequestException,
} from '@nestjs/common';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
    constructor(private readonly settingService: SettingService) {}

    @Get('rtmp/:name')
    async getSetting(@Param('name') name: string | undefined) {
        return await this.settingService.findRtmpConfig(name);
    }

    @Post('rtmp')
    async setSetting(@Body() body: RTMPConfigDTO) {
        await this.settingService.addRtmpConfig(body);
        return {
            message: 'ok',
        };
    }

    @Patch('rtmp/:name')
    async editSetting() {
        throw new BadRequestException('Method not implemented yet');
    }

    @Patch('rtmp/action/:name')
    async startStream(
        @Body() body: RTMPActionDTO,
        @Param('name') name?: string,
    ) {
        if (body.action === RTMPAction.listen) {
            await this.settingService.mediaServer.listen(name);
        } else if (body.action === RTMPAction.close) {
            await this.settingService.mediaServer.close();
        }
        return {
            message: 'ok',
        };
    }
}
