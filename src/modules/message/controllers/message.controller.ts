import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageService } from '../services/message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly _messageService: MessageService) {}

    @Get(':id')
    async Chat(@Param('id') id: string) {
        return await this._messageService.getMessages(id);
    }

    @Post()
    async createNewMessage(@Body() params: CreateMessageDto) {
        return await this._messageService.createMessage(params);
    }
}
