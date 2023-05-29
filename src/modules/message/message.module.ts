import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FamilyModule } from '../family/family.module';
import { MessageController } from './controllers/message.controller';
import { MessageEntity } from './entities/message.entity';
import { MessageGateway } from './gateway/message.gateway';
import { NotificationGateway } from './gateway/notification.gateway';
import { MessageService } from './services/message.service';

@Module({
    imports: [ConfigModule.forRoot(), FamilyModule, TypeOrmModule.forFeature([MessageEntity])],
    controllers: [MessageController],
    providers: [MessageService, MessageGateway, NotificationGateway],
    exports: [MessageService, NotificationGateway],
})
export class MessageModule {}
