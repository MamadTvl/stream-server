import { IsDefined, IsString } from 'class-validator';

export class LoginDTO {
    @IsDefined()
    @IsString()
    username: string;
    @IsDefined()
    @IsString()
    password: string;
}
