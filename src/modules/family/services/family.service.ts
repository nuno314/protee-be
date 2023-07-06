import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { StatusResponseDto } from '../../../common/dto/status-response.dto';
import { UtilsService } from '../../../shared/services/utils.service';
import { CreateNotificationDto } from '../../notification/dto/requests';
import { NotificationTypeEnum } from '../../notification/enums/notification-type.enum';
import { NotificationService } from '../../notification/services/notification.service';
import { UserDto } from '../../users/dtos/domains/user.dto';
import { FamilyUserDto } from '../../users/dtos/responses/user-family-response.dto';
import { UserEntity } from '../../users/entities/users.entity';
import { INVITE_CODE_LENGTH } from '../constant/family.constant';
import { UserInviteCodeDto } from '../dtos/responses/user-invite-code.dto';
import { FamilyEntity } from '../entities/family.entity';
import { FamilyInviteCodeEntity } from '../entities/family-invite-code.entity';
import { FamilyMemberEntity } from '../entities/family-member.entity';
import { JoinFamilyRequestEntity } from '../entities/join-family-request.entity';
import { FamilyRoleEnum } from '../enums/family-role.enum';

@Injectable()
export class FamilyService {
    constructor(
        @Inject(REQUEST) private readonly _req,
        @InjectRepository(FamilyEntity)
        private readonly _familyRepository: Repository<FamilyEntity>,
        @InjectRepository(FamilyMemberEntity)
        private readonly _familyMemberRepository: Repository<FamilyMemberEntity>,
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        @InjectRepository(FamilyInviteCodeEntity)
        private readonly _familyInviteCodeRepository: Repository<FamilyInviteCodeEntity>,
        @InjectRepository(JoinFamilyRequestEntity)
        private readonly _joinFamilyRequestRepository: Repository<JoinFamilyRequestEntity>,
        @InjectMapper() private readonly _mapper: Mapper,
        private readonly _notificationService: NotificationService
    ) {}

    public async getMemberInformationByUserId(userId: string): Promise<FamilyMemberEntity> {
        return await this._familyMemberRepository.findOneBy({ userId });
    }

    public async removeJoinRequest(requestId: string): Promise<StatusResponseDto> {
        if (!requestId) throw new BadRequestException('id_is_required');

        const request = await this._joinFamilyRequestRepository.findOneBy({ id: requestId });

        if (!request) throw new NotFoundException('request_not_found');

        const member = await this._familyMemberRepository.findOneBy({ userId: this._req.user.id });

        if (!member) throw new BadRequestException('user_not_a_family_member');

        if (member.familyId !== request.familyId) throw new ForbiddenException('not_same_family');
        if (member.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('only_parent_can_remove_join_request');

        const result = await this._joinFamilyRequestRepository.softRemove(request, { data: { request: this._req } });
        const notiRequest: CreateNotificationDto = {
            title: `Bạn đã bị từ chối tham gia vào gia đình`,
            content: '',
            isRead: false,
            type: NotificationTypeEnum.RejectedJoinFamily,
            userId: request.createdBy,
            familyId: null,
            data: {},
        };
        this._notificationService.create(notiRequest);
        return {
            result: !!result,
        };
    }

    public async getFamilyProfile(): Promise<FamilyEntity> {
        if (!this._req?.user?.id) {
            throw new UnauthorizedException();
        }
        const user = await this._userRepository.findOneBy({ id: this._req?.user?.id });
        if (!user) throw new UnauthorizedException();

        const member = await this._familyMemberRepository.findOneBy({ userId: user.id });

        if (!member) throw new BadRequestException('user_not_a_family_member');

        return await this._familyRepository.findOneBy({ id: member.familyId });
    }

    public async getFamilyMembers(): Promise<FamilyMemberEntity[]> {
        if (!this._req?.user?.id) {
            throw new UnauthorizedException();
        }
        const user = await this._userRepository.findOneBy({ id: this._req?.user?.id });
        if (!user) throw new UnauthorizedException();

        const member = await this._familyMemberRepository.findOneBy({ userId: user.id });

        if (!member) throw new BadRequestException('user_not_a_family_member');

        const members = await this._familyMemberRepository.find({
            where: { familyId: member.familyId, userId: Not(user.id) },
            select: { id: true, familyId: true, userId: true, role: true },
            relations: {
                user: true,
            },
        });
        return members.map((member: any) => {
            member.user.familyRole = member.role;
            member.user.familyId = member.familyId;

            return member;
        });
    }

    public async getJoinRequest(): Promise<JoinFamilyRequestEntity[]> {
        if (!this._req?.user?.id) {
            throw new UnauthorizedException();
        }

        const user = await this._userRepository.findOneBy({ id: this._req?.user?.id });
        if (!user) throw new UnauthorizedException();

        const member = await this._familyMemberRepository.findOneBy({ userId: user.id });

        if (!member) throw new BadRequestException('user_not_a_family_member');

        if (member.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('only_parent_can_get_request');
        const request = await this._joinFamilyRequestRepository.find({
            where: { familyId: member.familyId },
            select: { createdBy: true, id: true },
            relations: {
                user: true,
            },
        });
        return request;
    }

    public async getFamilyByUserId(userId: string): Promise<FamilyEntity> {
        const memberData = await this._familyMemberRepository.findOneBy({ userId });
        if (!memberData) throw new BadRequestException('user_is_not_a_family_member');

        return await this._familyRepository.findOneBy({ id: memberData.familyId });
    }

    public async approveJoinFamily(requestId: string): Promise<StatusResponseDto> {
        const request = await this._joinFamilyRequestRepository.findOneBy({ id: requestId });

        if (!request) throw new NotFoundException('request_not_found');

        const member = await this._familyMemberRepository.findOneBy({ userId: this._req.user.id });

        if (!member) throw new BadRequestException('user_not_a_family_member');

        if (member.familyId !== request.familyId) throw new ForbiddenException('not_same_family');
        if (member.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('only_parent_can_approve_join_request');

        try {
            const memberEntity = await this._familyMemberRepository.findOneBy({ userId: request.createdBy });
            if (memberEntity) {
                await this._familyMemberRepository.softRemove(memberEntity);
                await this._familyRepository.softRemove({ id: memberEntity.familyId });
            }
            const member: FamilyMemberEntity = {
                familyId: request.familyId,
                userId: request.createdBy,
                role: FamilyRoleEnum.Child,
                createdBy: this._req.user.id,
            };

            const createMemberResult = await this._familyMemberRepository.save(member, { data: { request: this._req } });
            await this._joinFamilyRequestRepository.softRemove(request);
            const notiRequest: CreateNotificationDto = {
                title: `Bạn đã được phê duyệt tham gia vào gia đình`,
                content: '',
                isRead: false,
                type: NotificationTypeEnum.ApprovedJoinFamily,
                userId: request.createdBy,
                familyId: member.familyId,
                data: {},
            };
            this._notificationService.create(notiRequest);
            return { result: !!createMemberResult };
        } catch (err) {
            console.log(err);
            return { result: false };
        }
    }

    public async getFamilyInviteCode(): Promise<UserInviteCodeDto> {
        if (!this._req?.user?.id) {
            throw new UnauthorizedException();
        }

        const user = await this._userRepository.findOneBy({ id: this._req?.user?.id });
        if (!user) throw new UnauthorizedException();

        const member = await this._familyMemberRepository.findOneBy({ userId: user.id });

        if (member) {
            const familyInviteCode = await this._familyInviteCodeRepository.findOneBy({ familyId: member.familyId });
            return {
                code: familyInviteCode?.code,
                user: {
                    ...user,
                    familyRole: member.role,
                    familyId: member.familyId,
                },
            };
        }
        try {
            const familyEntity: FamilyEntity = {
                name: `${user.name}'s family`,
                createdBy: this._req.user.id,
            };
            const createFamilyResult = await this._familyRepository.save(familyEntity, { data: { request: this._req } });

            const createMember: FamilyMemberEntity = {
                familyId: createFamilyResult.id,
                userId: user.id,
                role: FamilyRoleEnum.Parent,
                createdBy: this._req.user.id,
            };

            const createMemberResult = await this._familyMemberRepository.save(createMember, { data: { request: this._req } });

            let isExistedCode = true;
            while (isExistedCode) {
                const code = UtilsService.generateRandomString(INVITE_CODE_LENGTH);
                isExistedCode = !!(await this._familyInviteCodeRepository.findOneBy({ code }));
                if (isExistedCode) continue;
                const inviteCodeEntity: FamilyInviteCodeEntity = {
                    code,
                    familyId: createFamilyResult.id,
                    createdBy: this._req.user.id,
                };
                const createInviteCodeResult = await this._familyInviteCodeRepository.save(inviteCodeEntity, {
                    data: { request: this._req },
                });

                return {
                    code: createInviteCodeResult.code,
                    user: {
                        ...user,
                        familyRole: createMember.role,
                        familyId: createMember.familyId,
                    },
                };
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    public async joinFamilyByInviteCode(code: string): Promise<StatusResponseDto> {
        if (!code) throw new BadRequestException('code_is_required');

        const invideCodeEntity = await this._familyInviteCodeRepository.findOneBy({ code });

        if (!invideCodeEntity) throw new BadRequestException('invalid_code');

        const family = await this._familyRepository.findOneBy({ id: invideCodeEntity.familyId });

        if (!family) throw new NotFoundException('family_not_found');

        const memberEntity = await this._familyMemberRepository.findOneBy({ userId: this._req?.user?.id });

        const existedRequests = await this._joinFamilyRequestRepository.findBy({ createdBy: this._req?.user?.id });

        if (existedRequests?.length) {
            await this._joinFamilyRequestRepository.softRemove(existedRequests);
        }

        if (memberEntity) {
            const numberMemberOfCurrentFamily = await this._familyMemberRepository.countBy({ familyId: memberEntity.familyId });
            if (numberMemberOfCurrentFamily > 1) throw new BadRequestException('user_joined_other_family');

            if (memberEntity.role === FamilyRoleEnum.Parent) {
                const numberRequestJoin = await this._joinFamilyRequestRepository.countBy({ familyId: memberEntity.familyId });
                if (numberRequestJoin > 0) throw new BadRequestException('current_family_has_waiting_join_request');
            }
        }

        try {
            const request: JoinFamilyRequestEntity = {
                familyId: invideCodeEntity.familyId,
                isApproved: false,
                createdBy: this._req.user.id,
            };

            const createRequestResult = await this._joinFamilyRequestRepository.save(request, { data: { request: this._req } });
            const allParents = await this._familyMemberRepository.findBy({ familyId: family.id, role: FamilyRoleEnum.Parent });
            const user = await this._userRepository.findOneBy({ id: this._req.user.id });
            allParents.forEach((parent) => {
                const notiRequest: CreateNotificationDto = {
                    title: `<p><strong>${user?.name}</strong> đã yêu cầu tham gia gia đình</p>`,
                    content: '',
                    isRead: false,
                    type: NotificationTypeEnum.JoinRequest,
                    userId: parent.userId,
                    familyId: family.id,
                    data: {
                        requestId: createRequestResult.id,
                        createdByUser: {
                            name: user?.name,
                            id: user?.id,
                            avt: user?.avt,
                        },
                    },
                };
                this._notificationService.create(notiRequest);
            });
            return { result: !!createRequestResult };
        } catch (err) {
            console.log(err);
            return { result: false };
        }
    }

    public async leaveCurrentFamily(): Promise<FamilyUserDto | StatusResponseDto> {
        const member = await this._familyMemberRepository.findOneBy({ userId: this._req?.user?.id });

        if (!member) throw new BadRequestException('not_a_member');

        let result = false;

        if (member.role === FamilyRoleEnum.Child) {
            result = !!(await this._familyMemberRepository.softRemove(member, { data: { request: this._req } }));
        }

        const otherMembersOfFamily = await this._familyMemberRepository.findBy({ familyId: member.familyId, userId: Not(member.userId) });

        if (!otherMembersOfFamily.length) {
            result = !!(await this._familyMemberRepository.softRemove(member, { data: { request: this._req } }));
        }
        try {
            const otherParents = await this._familyMemberRepository.findOneBy({
                familyId: member.familyId,
                role: FamilyRoleEnum.Parent,
                userId: Not(member.userId),
            });

            if (!otherParents) throw new BadRequestException('the_only_parent_cannot_leave');
            result = !!(await this._familyMemberRepository.softRemove(member, { data: { request: this._req } }));

            if (!result) {
                return { result: false };
            }
            const user = await this._userRepository.findOneBy({ id: this._req?.user?.id });
            const allParents = await this._familyMemberRepository.findBy({ familyId: member.familyId, role: FamilyRoleEnum.Parent });
            allParents.forEach((parent) => {
                const notiRequest: CreateNotificationDto = {
                    title: `<p><strong>${user?.name}</strong> đã rời khỏi gia đình</p>`,
                    content: '',
                    isRead: false,
                    type: NotificationTypeEnum.LeaveFamily,
                    userId: parent.userId,
                    familyId: member.familyId,
                    data: {
                        user: {
                            name: user?.name,
                            id: user?.id,
                            avt: user?.avt,
                        },
                    },
                };
                this._notificationService.create(notiRequest);
            });
            return {
                ...user,
                familyRole: null,
            };
        } catch (err) {
            console.log(err);
            return { result: false };
        }
    }

    public async removeMemberFromFamily(memberId: string): Promise<StatusResponseDto> {
        const requestMember = await this._familyMemberRepository.findOneBy({ userId: this._req.user?.id });

        if (requestMember.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('no_permission');

        const needToDeleteMember = await this._familyMemberRepository.findOneBy({ id: memberId, familyId: requestMember.familyId });

        if (!needToDeleteMember) throw new NotFoundException('member_not_found');

        if (requestMember.id === memberId) throw new ForbiddenException('cannot_delete_yourself');

        const result = await this._familyMemberRepository.softRemove(needToDeleteMember, { data: { request: this._req } });
        const notiRequest: CreateNotificationDto = {
            title: `Bạn đã bị xoá khỏi gia đình`,
            content: '',
            isRead: false,
            type: NotificationTypeEnum.RemovedFromFamily,
            userId: needToDeleteMember.userId,
            familyId: null,
            data: {},
        };
        this._notificationService.create(notiRequest);

        return { result: !!result };
    }
    public async updateChildToParent(memberId: string): Promise<StatusResponseDto | FamilyMemberEntity> {
        const requestMember = await this._familyMemberRepository.findOneBy({ userId: this._req.user?.id });

        if (requestMember.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('no_permission');

        const needToUpdateMember = await this._familyMemberRepository.findOneBy({ id: memberId, familyId: requestMember.familyId });

        if (!needToUpdateMember) throw new NotFoundException('member_not_found');
        if (needToUpdateMember.role === FamilyRoleEnum.Parent) throw new ForbiddenException('it_is_parent');
        try {
            const result = await this._familyMemberRepository.save(
                { ...needToUpdateMember, role: FamilyRoleEnum.Parent, updatedBy: this._req.user.id },
                {
                    data: { request: this._req },
                }
            );

            const user = await this._userRepository.findOneBy({ id: needToUpdateMember.userId });
            const notiRequest: CreateNotificationDto = {
                title: `Bạn đã được chỉ định trở thành vai trò phụ huynh trong gia đình`,
                content: '',
                isRead: false,
                type: NotificationTypeEnum.UpgradeToParent,
                userId: user.id,
                familyId: needToUpdateMember.familyId,
                data: {
                    user: {
                        name: user?.name,
                        id: user?.id,
                        avt: user?.avt,
                    },
                },
            };
            this._notificationService.create(notiRequest);
            return { ...result, user: this._mapper.map(user, UserEntity, UserDto) as any };
        } catch (err) {
            return { result: false };
        }
    }
    public async updateParentToChild(memberId: string): Promise<StatusResponseDto | FamilyMemberEntity> {
        const requestMember = await this._familyMemberRepository.findOneBy({ userId: this._req.user?.id });

        if (requestMember.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('no_permission');

        const needToUpdateMember = await this._familyMemberRepository.findOneBy({ id: memberId, familyId: requestMember.familyId });

        if (!needToUpdateMember) throw new NotFoundException('member_not_found');
        if (needToUpdateMember.role === FamilyRoleEnum.Child) throw new ForbiddenException('it_is_child');
        if (needToUpdateMember.userId === requestMember.userId) throw new ForbiddenException('cannot_update_yourself');

        try {
            const result = await this._familyMemberRepository.save(
                { ...needToUpdateMember, role: FamilyRoleEnum.Child, updatedBy: this._req.user.id },
                {
                    data: { request: this._req },
                }
            );

            const user = await this._userRepository.findOneBy({ id: needToUpdateMember.userId });
            const notiRequest: CreateNotificationDto = {
                title: `Bạn đã được chỉ định trở thành vai trò trẻ em trong gia đình`,
                content: '',
                isRead: false,
                type: NotificationTypeEnum.DowngradeToChild,
                userId: user.id,
                familyId: needToUpdateMember.familyId,
                data: {
                    user: {
                        name: user?.name,
                        id: user?.id,
                        avt: user?.avt,
                    },
                },
            };
            this._notificationService.create(notiRequest);

            return { ...result, user: this._mapper.map(user, UserEntity, UserDto) as any };
        } catch (err) {
            return { result: false };
        }
    }
}
