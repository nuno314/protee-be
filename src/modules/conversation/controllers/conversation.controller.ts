import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from '../../../decorators/customer.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { ConversationService } from '../services/conversation.service';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly _conversationService: ConversationService) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getAllListChat(@User() user) {
        return await this._conversationService.getAllListChat(user.id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createConversation(@User() user, @Body() receiver: { receiverId: string }) {
        return await this._conversationService.createConversation(user.id, receiver.receiverId);
    }
}
