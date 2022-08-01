import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsDefined,
    IsEnum,
    IsNumber,
    IsObject,
    IsString,
    ValidateIf,
    ValidateNested,
} from 'class-validator';

class RTMP {
    @ApiProperty()
    @IsDefined()
    @IsNumber()
    chunk_size: number;
    @ApiProperty()
    @IsDefined()
    @IsBoolean()
    gop_cache: boolean;
    @IsDefined()
    @IsNumber()
    @ApiProperty()
    ping: number;
    @ApiProperty()
    @IsDefined()
    @IsNumber()
    ping_timeout: number;
}

class Http {
    @ApiProperty()
    @IsDefined()
    @IsString()
    allow_origin: string;
}

class Auth {
    @ApiProperty()
    play: true;
    @ApiProperty()
    publish: true;
}

class Task {
    @ApiProperty()
    @IsDefined()
    @IsString()
    app: string;
    @ApiProperty()
    @IsDefined()
    @IsBoolean()
    hls: true;
    @ApiProperty()
    @IsDefined()
    @IsString()
    hlsFlags: string;
}

class Trans {
    @ApiProperty()
    @IsDefined()
    @IsString()
    ffmpeg: string;
    @ApiProperty({ isArray: true, type: Task })
    @IsDefined()
    @ArrayNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Task)
    tasks: Task[];
}

class RTMPServer {
    @ApiProperty()
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => RTMP)
    rtmp: RTMP;
    @ApiProperty()
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => Http)
    http: Http;
    @ApiPropertyOptional()
    @ValidateIf((obj) => !!obj.auth)
    @IsObject()
    @ValidateNested()
    @Type(() => Auth)
    auth?: Auth;
    @ApiProperty()
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => Trans)
    trans: Trans;
}

export class RTMPConfigDTO {
    @ApiProperty()
    @IsDefined()
    @IsString()
    name: string;
    @ApiProperty()
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => RTMPServer)
    rtmp_server: RTMPServer;
    @ApiProperty()
    @IsDefined()
    @IsBoolean()
    default: boolean;
}

export enum RTMPAction {
    listen = 'listen',
    close = 'close',
}

export class RTMPActionDTO {
    @ApiProperty({ type: 'enum', enum: RTMPAction })
    @IsDefined()
    @IsEnum(RTMPAction)
    action: RTMPAction;
}
