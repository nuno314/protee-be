import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageEntity } from '../entities/message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private _messageRepo: Repository<MessageEntity>
    ) {}

    async findConversation(conversationId: string, sender: string, receiver: string) {
        if (!conversationId) throw new BadRequestException('Invalid conversation');

        try {
            const conversationExist = await this._messageRepo.save({
                conversation_id: conversationId,
                content: 'Hello!!',
                sender: sender,
                receiver: receiver,
            });

            return conversationExist;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async createMessage(params: CreateMessageDto): Promise<MessageEntity> {
        return await this._messageRepo.save(params);
    }

    async getMessages(conversationId: string): Promise<MessageEntity[]> {
        return await this._messageRepo.find({
            where: { conversation_id: conversationId },
        });
    }
}
