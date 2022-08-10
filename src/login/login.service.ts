import { User, UserDocument } from './../schema/User.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

@Injectable()
export class LoginService {
    constructor(
        @InjectModel(User.name) public userModel: Model<UserDocument>,
    ) {}

    private async getUser(username: string, password: string): Promise<User> {
        const user = await this.userModel.findOne({ username: username });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new BadRequestException('invalid username or password');
        }
        return user;
    }

    public async createUser(username: string, password: string): Promise<void> {
        const user = new this.userModel({
            username: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
        });
        await this.userModel.create(user);
    }

    public async getToken(username: string, password: string): Promise<string> {
        await this.getUser(username, password);
        const token = uuidv4();
        await this.userModel.updateOne(
            { username: username },
            {
                $set: {
                    token: createHash('sha256').update(token).digest('hex'),
                },
            },
        );
        return token;
    }
}
