import { IsDefined, IsNumber, IsString } from 'class-validator';

export class StreamDTO {
    @IsDefined()
    @IsString()
    name: string;
    @IsDefined()
    @IsNumber()
    expireDate: number;
}
