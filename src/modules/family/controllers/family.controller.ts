import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../common/base.controller';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { FamilyService } from '../services/family.service';

@Controller('family')
@ApiTags('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FamilyController extends BaseController {
    constructor(private readonly _familyService: FamilyService) {
        super();
    }
    @ApiOperation({ summary: 'Get family profile' })
    @Get('/profile')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async getFamilyProfile() {
        return await this._familyService.getFamilyProfile();
    }

    @ApiOperation({ summary: 'Get family members' })
    @Get('/profile')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async getFamilyMembers() {
        return await this._familyService.getFamilyMembers();
    }

    @ApiOperation({ summary: 'Get join family requests' })
    @Get('/invite-code')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async getJoinRequest() {
        return await this._familyService.getJoinRequest();
    }

    @ApiOperation({ summary: 'Get invite code' })
    @Get('/invite-code')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async createInviteCode() {
        return await this._familyService.getFamilyInviteCode();
    }

    @ApiOperation({ summary: 'Join family using code' })
    @Post('/join')
    @Version('1')
    @UseGuards(JwtAuthGuard)
    async joinFamily(@Body() body: { code: string }) {
        return await this._familyService.joinFamilyByInviteCode(body.code);
    }
    @ApiOperation({ summary: 'Parent approve' })
    @Post('/approve')
    @Version('1')
    @UseGuards(JwtAuthGuard)
    async approveJoin(@Body() body: { requestId: string }) {
        return await this._familyService.approveJoinFamily(body.requestId);
    }

    @ApiOperation({ summary: 'Leave family' })
    @Post('/leave')
    @Version('1')
    @UseGuards(JwtAuthGuard)
    async leaveFamily() {
        return await this._familyService.leaveCurrentFamily();
    }
    @ApiOperation({ summary: 'Remove member from family' })
    @Post('/remove')
    @Version('1')
    @UseGuards(JwtAuthGuard)
    async removeMember(@Body() body: { memberId: string }) {
        return await this._familyService.removeMemberFromFamily(body.memberId);
    }
}
