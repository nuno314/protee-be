import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigService } from '../../shared/services/app-config.service';
import { FamilyModule } from '../family/family.module';
import { MessageController } from './controllers/message.controller';
import { MessageEntity } from './entities/message.entity';
import { ChatGateway } from './gateway/chat.gateway';
import { MessageService } from './services/message.service';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('APP_SECRET'),
                signOptions: { expiresIn: '24h' },
            }),
        }),
        ConfigModule.forRoot(),
        FamilyModule,
        TypeOrmModule.forFeature([MessageEntity]),
    ],
    controllers: [MessageController],
    providers: [MessageService, ChatGateway],
    exports: [MessageService, ChatGateway],
})
export class MessageModule {}
