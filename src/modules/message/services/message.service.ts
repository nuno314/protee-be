import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationRequestDto } from '../../../common/dto/pagination-request.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { FamilyService } from '../../family/services/family.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MessageEntity } from '../entities/message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(MessageEntity)
        private _messageRepo: Repository<MessageEntity>,
        @Inject(REQUEST) private readonly _req,
        private readonly _familyService: FamilyService
    ) {}
    async createMessage(params: CreateMessageDto): Promise<MessageEntity> {
        const family = await this._familyService.getFamilyByUserId(this._req.user.id);
        if (!family) throw new NotFoundException('family_not_found');

        const message: MessageEntity = {
            content: params.content,
            familyId: family.id,
            seenBy: [],
        };
        return await this._messageRepo.save(message, { data: { request: this._req } });
    }

    async getMessages(params: PaginationRequestDto): Promise<PaginationResponseDto<MessageEntity>> {
        const family = await this._familyService.getFamilyByUserId(this._req.user.id);

        if (!family) throw new NotFoundException('family_not_found');

        let builder = this._messageRepo.createQueryBuilder();

        if (params?.filter) {
            builder.andWhere(`LOWER(content) LIKE '%${params.filter.toLowerCase()}%'`);
        }

        builder = builder.skip(params.skip).take(params.take).orderBy('created_at', 'DESC');

        try {
            const [result, total] = await builder.getManyAndCount();

            return {
                data: result,
                total: total,
            };
        } catch (err) {
            console.log(err);
            return {
                data: [],
                total: 0,
            };
        }
    }
}
