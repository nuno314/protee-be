// eslint-disable-next-line simple-import-sort/imports
import { REQUEST } from '@nestjs/core';
import { Mapper } from '@automapper/core';
import { DataSource, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';

import { NotificationDto } from '../dto/notification.dto';
import { NotificationEntity } from '../entities/notification.entity';
import { GetLatestNotificationResponse } from '../dto/responses';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { CreateNotificationDto, GetNotificationPagingRequest } from '../dto/requests';
import { ChatGateway } from '../../message/gateway/chat.gateway';
import { FamilyMemberEntity } from '../../family/entities/family-member.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable({ scope: Scope.REQUEST })
export class NotificationService {
    private notificationRepository: Repository<NotificationEntity>;

    constructor(
        private dataSource: DataSource,
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        @Inject(REQUEST) private readonly req,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly _socketGateway: ChatGateway,
        @InjectRepository(FamilyMemberEntity)
        private readonly _familyMemberRepository: Repository<FamilyMemberEntity>
    ) {
        this.notificationRepository = this.dataSource.getRepository(NotificationEntity);
    }

    private async _getUserFamilyId(): Promise<string> {
        return (await this._familyMemberRepository.findOneBy({ userId: this.req.user.id }))?.familyId || '';
    }

    async create(notification: CreateNotificationDto): Promise<boolean> {
        const entity = this.mapper.map(notification, CreateNotificationDto, NotificationEntity);
        const response = await this.notificationRepository.save(entity, { data: { request: this.req } });
        if (response && response.id) {
            this._socketGateway.emitUserNotificationToRoom(entity, `user_notification_${notification.userId}`);
            return true;
        }
        return false;
    }

    async getLatestNotification(): Promise<GetLatestNotificationResponse> {
        const familyId = await this._getUserFamilyId();
        const userId = this.req.user.id;

        const condition: any = {
            userId: userId,
        };
        if (familyId) condition.familyId = familyId;
        const notifications = await this.notificationRepository.find({
            take: 10,
            order: { createdAt: 'DESC' },
            where: condition,
        });
        const dtos: NotificationDto[] = this.mapper.mapArray(notifications, NotificationEntity, NotificationDto);

        const response = new GetLatestNotificationResponse();
        response.notifications = dtos;

        const totalUnread = await this.notificationRepository.countBy({
            userId: userId,
            familyId: familyId,
            isRead: false,
        });

        response.totalUnread = totalUnread;

        return response;
    }

    async get(request: GetNotificationPagingRequest): Promise<PaginationResponseDto<NotificationDto>> {
        try {
            const familyId = await this._getUserFamilyId();
            const userId = this.req.user.id;
            const where: any = {
                userId: userId,
            };
            if (familyId) where.familyId = familyId;

            if (request.filterUnread) {
                where.isRead = false;
            }

            const [notifications, total] = await this.notificationRepository.findAndCount({
                skip: request.skip,
                take: request.take,
                order: { createdAt: 'DESC' },
                where: where,
            });
            const dtos: NotificationDto[] = this.mapper.mapArray(notifications, NotificationEntity, NotificationDto);

            const response = new PaginationResponseDto<NotificationDto>();
            response.data = dtos;
            response.total = total;

            return response;
        } catch (error) {
            return {
                data: [],
                total: 0,
            };
        }
    }

    async setReadNotification(id: string): Promise<NotificationDto> {
        try {
            const userId = this.req.user.id;
            const notification = await this.notificationRepository.findOneBy({
                userId: userId,
                id: id,
            });

            if (!notification) {
                return null;
            }

            notification.isRead = true;
            await this.notificationRepository.save(notification, { data: { request: this.req } });
            return this.mapper.map(notification, NotificationEntity, NotificationDto);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async toggleReadNotification(id: string): Promise<NotificationDto> {
        try {
            const userId = this.req.user.id;
            const notification = await this.notificationRepository.findOneBy({
                userId: userId,
                id: id,
            });

            if (!notification) {
                return null;
            }

            notification.isRead = !notification.isRead;
            await this.notificationRepository.save(notification, { data: { request: this.req } });
            return this.mapper.map(notification, NotificationEntity, NotificationDto);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async markAllAsRead(): Promise<{ result: boolean }> {
        try {
            const userId = this.req.user.id;
            const notifications = await this.notificationRepository.findBy({
                userId: userId,
            });

            for (const notification of notifications) {
                notification.isRead = true;
            }

            await this.notificationRepository.save(notifications, { data: { request: this.req } });

            return { result: true };
        } catch (error) {
            console.log(error);
            return { result: false };
        }
    }
}
