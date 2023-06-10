import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { UtilsService } from '../../../shared/services/utils.service';
import { UserEntity } from '../../users/entities/users.entity';
import { INVITE_CODE_LENGTH } from '../constant/family.constant';
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
        @InjectMapper() private readonly _mapper: Mapper
    ) {}

    public async getMemberInformationByUserId(userId: string): Promise<FamilyMemberEntity> {
        return await this._familyMemberRepository.findOneBy({ userId });
    }

    public async removeJoinRequest(requestId: string): Promise<boolean> {
        if (!requestId) throw new BadRequestException('id_is_required');

        const request = await this._joinFamilyRequestRepository.findOneBy({ id: requestId });

        if (!request) throw new NotFoundException('request_not_found');

        const member = await this._familyMemberRepository.findOneBy({ userId: this._req.user.id });

        if (!member) throw new BadRequestException('user_not_a_family_member');

        if (member.familyId !== request.familyId) throw new ForbiddenException('not_same_family');
        if (member.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('only_parent_can_remove_join_request');

        return !!(await this._joinFamilyRequestRepository.softRemove(request, { data: { request: this._req } }));
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
            select: { userId: true },
            relations: {
                user: true,
            },
        });
        return members;
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
            select: { createdBy: true },
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

    public async approveJoinFamily(requestId: string): Promise<boolean> {
        const request = await this._joinFamilyRequestRepository.findOneBy({ id: requestId });

        if (!request) throw new NotFoundException('request_not_found');

        const member = await this._familyMemberRepository.findOneBy({ userId: this._req.user.id });

        if (!member) throw new BadRequestException('user_not_a_family_member');

        if (member.familyId !== request.familyId) throw new ForbiddenException('not_same_family');
        if (member.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('only_parent_can_approve_join_request');

        try {
            const member: FamilyMemberEntity = {
                familyId: request.familyId,
                userId: request.createdBy,
                role: FamilyRoleEnum.Child,
                createdBy: this._req.user.id,
            };

            const createMemberResult = await this._familyMemberRepository.save(member, { data: { request: this._req } });
            await this._joinFamilyRequestRepository.softRemove(request);
            return !!createMemberResult;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    public async getFamilyInviteCode(): Promise<string> {
        if (!this._req?.user?.id) {
            throw new UnauthorizedException();
        }

        const user = await this._userRepository.findOneBy({ id: this._req?.user?.id });
        if (!user) throw new UnauthorizedException();

        const member = await this._familyMemberRepository.findOneBy({ userId: user.id });

        if (member) {
            const familyInviteCode = await this._familyInviteCodeRepository.findOneBy({ familyId: member.familyId });
            return familyInviteCode.code;
        }
        try {
            const familyEntity: FamilyEntity = {
                name: `${user.name}'s family`,
                createdBy: this._req.user.id,
            };
            const createFamilyResult = await this._familyRepository.save(familyEntity, { data: { request: this._req } });

            const member: FamilyMemberEntity = {
                familyId: createFamilyResult.id,
                userId: user.id,
                role: FamilyRoleEnum.Parent,
                createdBy: this._req.user.id,
            };

            const createMemberResult = await this._familyMemberRepository.save(member, { data: { request: this._req } });

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

                return createInviteCodeResult.code;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    public async joinFamilyByInviteCode(code: string): Promise<boolean> {
        if (!code) throw new BadRequestException('code_is_required');

        const invideCodeEntity = await this._familyInviteCodeRepository.findOneBy({ code });

        if (!invideCodeEntity) throw new BadRequestException('invalid_code');

        const memberEntity = await this._familyMemberRepository.findOneBy({ userId: this._req?.user?.id });

        if (memberEntity) {
            const numberMemberOfCurrentFamily = await this._familyMemberRepository.countBy({ familyId: memberEntity.familyId });
            if (numberMemberOfCurrentFamily > 1) throw new BadRequestException('user_joined_other_family');

            if (memberEntity.role === FamilyRoleEnum.Parent) {
                const numberRequestJoin = await this._joinFamilyRequestRepository.countBy({ familyId: memberEntity.familyId });
                if (numberRequestJoin > 0) throw new BadRequestException('current_family_has_waiting_join_request');
            }

            await this._familyMemberRepository.softRemove(memberEntity);
            await this._familyRepository.softRemove({ id: memberEntity.familyId });
        }

        try {
            const request: JoinFamilyRequestEntity = {
                familyId: invideCodeEntity.familyId,
                isApproved: false,
                createdBy: this._req.user.id,
            };

            const createRequestResult = await this._joinFamilyRequestRepository.save(request, { data: { request: this._req } });
            return !!createRequestResult;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    public async leaveCurrentFamily(): Promise<boolean> {
        const member = await this._familyMemberRepository.findOneBy({ userId: this._req?.user?.id });

        if (!member) throw new BadRequestException('not_a_member');

        if (member.role === FamilyRoleEnum.Child) {
            return !!(await this._familyMemberRepository.softRemove(member, { data: { request: this._req } }));
        }

        const otherMembersOfFamily = await this._familyMemberRepository.findBy({ familyId: member.familyId, userId: Not(member.userId) });

        if (!otherMembersOfFamily.length) {
            return !!(await this._familyMemberRepository.softRemove(member, { data: { request: this._req } }));
        }

        const otherParents = await this._familyMemberRepository.findOneBy({
            familyId: member.familyId,
            role: FamilyRoleEnum.Parent,
            userId: Not(member.userId),
        });

        if (!otherParents) throw new BadRequestException('the_only_parent_cannot_leave');

        return !!(await this._familyMemberRepository.softRemove(member, { data: { request: this._req } }));
    }

    public async removeMemberFromFamily(memberId: string): Promise<boolean> {
        const requestMember = await this._familyMemberRepository.findOneBy({ userId: this._req.user?.id });

        if (requestMember.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('no_permission');

        const needToDeleteMember = await this._familyMemberRepository.findOneBy({ id: memberId, familyId: requestMember.familyId });

        if (!needToDeleteMember) throw new NotFoundException('member_not_found');

        return !!(await this._familyMemberRepository.softRemove(needToDeleteMember, { data: { request: this._req } }));
    }
    public async updateChildToParent(memberId: string): Promise<boolean> {
        const requestMember = await this._familyMemberRepository.findOneBy({ userId: this._req.user?.id });

        if (requestMember.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('no_permission');

        const needToUpdateMember = await this._familyMemberRepository.findOneBy({ id: memberId, familyId: requestMember.familyId });

        if (!needToUpdateMember) throw new NotFoundException('member_not_found');
        if (needToUpdateMember.role === FamilyRoleEnum.Parent) throw new ForbiddenException('it_is_parent');
        const result = await this._familyMemberRepository.save(
            { ...needToUpdateMember, role: FamilyRoleEnum.Parent, updatedBy: this._req.user.id },
            {
                data: { request: this._req },
            }
        );
        return !!result;
    }
    public async updateParentToChild(memberId: string): Promise<boolean> {
        const requestMember = await this._familyMemberRepository.findOneBy({ userId: this._req.user?.id });

        if (requestMember.role !== FamilyRoleEnum.Parent) throw new ForbiddenException('no_permission');

        const needToUpdateMember = await this._familyMemberRepository.findOneBy({ id: memberId, familyId: requestMember.familyId });

        if (!needToUpdateMember) throw new NotFoundException('member_not_found');
        if (needToUpdateMember.role === FamilyRoleEnum.Child) throw new ForbiddenException('it_is_child');
        if (needToUpdateMember.userId === requestMember.userId) throw new ForbiddenException('cannot_update_yourself');
        const result = await this._familyMemberRepository.save(
            { ...needToUpdateMember, role: FamilyRoleEnum.Child, updatedBy: this._req.user.id },
            {
                data: { request: this._req },
            }
        );
        return !!result;
    }
}
