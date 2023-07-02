// eslint-disable-next-line simple-import-sort/imports
import { NotificationDto } from '../dto/notification.dto';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { GetNotificationPagingRequest } from '../dto/requests';
import { GetLatestNotificationResponse } from '../dto/responses';
import { BaseController } from '../../../common/base.controller';
import { NotificationService } from '../services/notification.service';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, HttpStatus, Param, Post, Query, UseGuards, Version } from '@nestjs/common';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
export class NotificationController extends BaseController {
    constructor(private readonly notificationService: NotificationService) {
        super();
    }

    @ApiOperation({ summary: 'Get notifications' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get notifications',
    })
    @UseGuards(JwtAuthGuard)
    @Get()
    @Version('1')
    async get(@Query() request: GetNotificationPagingRequest): Promise<PaginationResponseDto<NotificationDto>> {
        return await this.notificationService.get(request);
    }

    @ApiOperation({ summary: 'Get latest notifications' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get latest notifications',
    })
    @UseGuards(JwtAuthGuard)
    @Get('getLatestNotifications')
    @Version('1')
    async getLatestNotifications(): Promise<GetLatestNotificationResponse> {
        return await this.notificationService.getLatestNotification();
    }

    @ApiOperation({ summary: 'Read notification' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Read notification',
    })
    @UseGuards(JwtAuthGuard)
    @Post('read/:id')
    @Version('1')
    async setReadNotification(@Param('id') id: string): Promise<boolean> {
        return await this.notificationService.setReadNotification(id);
    }

    @ApiOperation({ summary: 'Toggle read notification' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Toggle notification',
    })
    @UseGuards(JwtAuthGuard)
    @Post('toggle-read/:id')
    @Version('1')
    async toggleReadNotification(@Param('id') id: string): Promise<boolean> {
        return await this.notificationService.toggleReadNotification(id);
    }

    @ApiOperation({ summary: 'Mark all as read' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Toggle notification',
    })
    @UseGuards(JwtAuthGuard)
    @Post('mark-all-as-read')
    @Version('1')
    async markAllAsRead(): Promise<boolean> {
        return await this.notificationService.markAllAsRead();
    }
}
