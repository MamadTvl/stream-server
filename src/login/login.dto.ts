import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginDTO {
    @ApiProperty({ type: 'string' })
    @IsDefined()
    @IsString()
    username: string;
    @ApiProperty({ type: 'string' })
    @IsDefined()
    @IsString()
    password: string;
}
