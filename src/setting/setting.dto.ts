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
} from 'class-validator';

class RTMP {
    @IsDefined()
    @IsNumber()
    chunk_size: number;
    @IsDefined()
    @IsBoolean()
    gop_cache: boolean;
    @IsDefined()
    @IsNumber()
    ping: number;
    @IsDefined()
    @IsNumber()
    ping_timeout: number;
}

class Http {
    @IsDefined()
    @IsString()
    allow_origin: string;
}

class Auth {
    play: true;
    publish: true;
}

class Task {
    @IsDefined()
    @IsString()
    app: string;
    @IsDefined()
    @IsBoolean()
    hls: true;
    @IsDefined()
    @IsString()
    hlsFlags: string;
}

class Trans {
    @IsDefined()
    @IsString()
    ffmpeg: string;
    @IsDefined()
    @ArrayNotEmpty()
    @IsArray({ each: true })
    tasks: Task[];
}

class RTMPServer {
    @IsDefined()
    @IsObject({ each: true })
    rtmp: RTMP;
    @IsDefined()
    @IsObject({ each: true })
    http: Http;
    @ValidateIf((obj) => !!obj.auth)
    @IsObject({ each: true })
    auth?: Auth;
    @IsDefined()
    @IsObject({ each: true })
    trans: Trans;
}

export class RTMPConfigDTO {
    @IsDefined()
    @IsString()
    name: string;
    @IsDefined()
    @IsObject({ each: true })
    rtmp_server: RTMPServer;
    @IsDefined()
    @IsBoolean()
    default: boolean;
}

export enum RTMPAction {
    listen = 'listen',
    close = 'close',
}

export class RTMPActionDTO {
    @IsDefined()
    @IsEnum(RTMPAction)
    action: RTMPAction;
}
