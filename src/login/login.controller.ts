import { LoginDTO } from './login.dto';
import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('login')
@Controller('login')
export class LoginController {
    constructor(private readonly loginService: LoginService) {}
    @ApiOperation({ summary: 'get access token' })
    @Post()
    async login(@Body() body: LoginDTO) {
        return {
            message: 'ok',
            data: await this.loginService.getToken(
                body.username,
                body.password,
            ),
        };
    }
    @Post('startup')
    async startup(@Body() body: LoginDTO) {
        if ((await this.loginService.userModel.count()) > 0) {
            throw new NotFoundException();
        }
        await this.loginService.createUser(body.username, body.password);
        return {
            message: 'ok',
        };
    }
}
