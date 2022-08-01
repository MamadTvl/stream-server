import { AuthRequest } from 'src/common/middleware/authorization.middleware';
import { Controller, Post, Req, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('add')
    addUser(@Req() req: AuthRequest) {
        throw new BadRequestException('Method not implemented yet');
    }
}
