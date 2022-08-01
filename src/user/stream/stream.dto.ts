import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class StreamDTO {
    @ApiProperty({ type: 'string' })
    @IsDefined()
    @IsString()
    name: string;
    @ApiProperty({ type: 'number', description: 'unix timestamp' })
    @IsDefined()
    @IsNumber()
    expireDate: number;
}
