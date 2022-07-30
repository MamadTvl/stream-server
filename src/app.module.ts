import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaServerModule } from './media-server/media-server.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(
            `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
            {
                dbName: process.env.MONGO_DATABASE,
                auth: {
                    username: process.env.MONGO_USER,
                    password: process.env.MONGO_PASSWORD,
                },
                authSource: process.env.MONGO_AUTH_SOURCE,
            },
        ),
        MediaServerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
