import { User, UserDocument } from './../../schema/User.schema';
import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { createHash } from 'crypto';
import { Stream } from 'src/schema/Stream.schema';

export interface AuthRequest extends Request {
    user: User | null;
}

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}
    async use(req: AuthRequest, res: Response, next: NextFunction) {
        const token = req.headers.authorization;
        if (!token) {
            throw new UnauthorizedException();
        }
        const user = await this.userModel.findOne(
            {
                token: createHash('sha256').update(token).digest('hex'),
            },
            {},
            {
                populate: {
                    path: 'streams',
                },
            },
        );
        if (!user) {
            throw new UnauthorizedException();
        }
        req.user = user;
        next();
    }
}
