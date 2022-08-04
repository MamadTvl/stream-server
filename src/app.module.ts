import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaServerModule } from './media-server/media-server.module';
import { SettingModule } from './setting/setting.module';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import { User, UserSchema } from './schema/User.schema';
import { AuthorizationMiddleware } from './common/middleware/authorization.middleware';

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
                connectionFactory: (connection) => {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    connection.plugin(require('mongoose-autopopulate'));
                    return connection;
                },
            },
        ),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
        MediaServerModule,
        SettingModule,
        UserModule,
        LoginModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthorizationMiddleware)
            .exclude(
                { path: 'login', method: RequestMethod.POST },
                { path: 'login/startup', method: RequestMethod.POST },
                'docs',
            )
            .forRoutes('*');
    }
}
