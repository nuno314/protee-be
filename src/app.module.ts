import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { FamilyModule } from './modules/family/family.module';
import { LocationModule } from './modules/location/location.module';
import { MessageModule } from './modules/message/message.module';
import { SystemUsersModule } from './modules/system-users/system-users.module';
import { UsersModule } from './modules/users/users.module';
import { SeederModule } from './seeder/seeder.module';
import { AppLoggerMiddleware } from './shared/middleware/app.logger.middleware';
import { AppConfigService } from './shared/services/app-config.service';
import { SharedModule } from './shared/shared.module';

const modules = [SharedModule, UsersModule, AuthModule, SystemUsersModule, SeederModule, LocationModule, MessageModule, FamilyModule];
@Module({
    imports: [
        ...modules,
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: AppConfigService) => configService.typeOrmPostgreSqlConfig,
            inject: [AppConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
