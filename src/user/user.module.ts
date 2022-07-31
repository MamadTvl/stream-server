import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StreamModule } from './stream/stream.module';

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [StreamModule],
})
export class UserModule {}
