import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageService } from '../../message/services/message.service';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { ConversationEntity } from '../entities/conversation.entity';

@Injectable()
export class ConversationService {
    constructor(
        @InjectRepository(ConversationEntity)
        private readonly _conversationRepo: Repository<ConversationEntity>,
        private readonly _messageRepo: MessageService
    ) {}

    // handle create a new conversation
    async createConversation(userId: string, receiverId: string) {
        if (!userId) throw new BadRequestException('User not found');

        // check conversation between user and receiver is exist
        const conversationExist: CreateConversationDto = await this._conversationRepo.findOne({
            where: { userId: userId, receiver: receiverId },
        });

        // if (conversationExist) return conversationExist;

        try {
            // create new conversation
            const conversation = await this._conversationRepo.save({
                ...conversationExist,
                userId: userId,
                receiver: receiverId,
            });

            // find conversation in table message is exist or not
            const createConversation = await this._messageRepo.findConversation(conversation.id, userId, receiverId);

            return createConversation;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    // handle show list chat
    async getAllListChat(userId: string) {
        if (!userId) throw new BadRequestException('User not found');

        try {
            const listChat = await this._conversationRepo.query(`select DISTINCT ON (conversation.id) 
      conversation_id , m.content, u.avatar, u.name, u.id,  m.created_at from conversation   
       left join message m on conversation.id = m.conversation_id   
        left join "user" u on u.id = m.receiver::uuid where 
        (conversation.user_id = '${userId}'       
         or conversation.receiver = '${userId}')
         group by  conversation.id, m.id, u.id 
         order by  conversation.id, m.created_at desc`);

            return listChat;
        } catch (error) {
            console.log(error);
            throw new BadRequestException(error);
        }
    }
}
