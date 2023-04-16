import './boilerplate.polyfill';

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SystemUsersModule } from './modules/system-users/system-users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './shared/services/app-config.service';
import { AppLoggerMiddleware } from './shared/middleware/app.logger.middleware';
import { SeederModule } from './seeder/seeder.module';
const modules = [SharedModule, UsersModule, AuthModule, SystemUsersModule, SeederModule];
@Module({
    imports: [...modules, TypeOrmModule.forRootAsync({
        imports: [SharedModule],
        useFactory: (configService: AppConfigService) => configService.typeOrmPostgreSqlConfig,
        inject: [AppConfigService],
    }),],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
