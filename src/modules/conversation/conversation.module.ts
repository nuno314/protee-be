import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageModule } from './../message/message.module';
import { ConversationController } from './controllers/conversation.controller';
import { ConversationEntity } from './entities/conversation.entity';
import { ConversationService } from './services/conversation.service';

@Module({
    imports: [TypeOrmModule.forFeature([ConversationEntity]), MessageModule],
    controllers: [ConversationController],
    providers: [ConversationService],
})
export class ConversationModule {}
