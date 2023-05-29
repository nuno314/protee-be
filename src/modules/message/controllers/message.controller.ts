import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaginationRequestDto } from '../../../common/dto/pagination-request.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageEntity } from '../entities/message.entity';
import { MessageService } from '../services/message.service';

@Controller('message')
@ApiTags('message')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MessageController {
    constructor(private readonly _messageService: MessageService) {}

    @ApiOperation({ summary: 'Get messages from family chat' })
    @Get('/messages')
    async getMessages(@Query() params: PaginationRequestDto): Promise<PaginationResponseDto<MessageEntity>> {
        return await this._messageService.getMessages(params);
    }

    @ApiOperation({ summary: 'Create message to family chat' })
    @Post()
    async createNewMessage(@Body() request: CreateMessageDto): Promise<MessageEntity> {
        return await this._messageService.createMessage(request);
    }
}
