import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository } from 'typeorm';

import { PaginationRequestDto } from '../../../common/dto/pagination-request.dto';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { UserDto } from '../dtos/domains/user.dto';
import { UpdateAccountDto } from '../dtos/requests/update-account.dto';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UserEntity } from '../entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject(REQUEST) private readonly _req,
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        @InjectMapper() private readonly _mapper: Mapper
    ) {}

    public async update(dto: UpdateUserDto): Promise<boolean> {
        const user = await this._userRepository.findOneBy({ id: dto.id });

        if (!user) throw new NotFoundException('user_not_found');

        const updateUser = { ...user, ...dto, updatedBy: this._req.user.id };

        try {
            const result = await this._userRepository.save(updateUser, {
                data: { request: this._req },
            });
            return !!result;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    public async updateProfile(userId: string, dto: UpdateAccountDto): Promise<UserDto> {
        const user = await this._userRepository.findOneBy({ id: userId });

        if (!user) throw new NotFoundException('user_not_found');

        const updateUser: UserEntity = { ...user, ...dto, updatedBy: this._req.user.id };

        try {
            const result = await this._userRepository.save(updateUser, {
                data: { request: this._req },
            });
            return this._mapper.map(result, UserEntity, UserDto);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async getPagedList(request: PaginationRequestDto): Promise<PaginationResponseDto<UserDto>> {
        try {
            const queryBuilder = this._userRepository.createQueryBuilder('user');

            if (request.filter) {
                const filter = request.filter ? request.filter : '';
                queryBuilder.andWhere([{ name: ILike(`%${filter}%`) }]);
            }

            const sortField: FindOptionsOrder<UserEntity> = {};
            sortField[request.sortField] = request.order;

            queryBuilder.skip(request.skip).take(request.take);
            queryBuilder.orderBy(request.sortField, request.order === 'ASC' ? 'ASC' : 'DESC');

            const [result, total] = await queryBuilder.getManyAndCount();
            const customerDtos = this._mapper.mapArray(result, UserEntity, UserDto);
            return {
                data: customerDtos,
                total,
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    public async getById(id: string): Promise<UserDto> {
        try {
            const user = await this._userRepository.findOneBy({ id });

            if (!user) throw new NotFoundException('user_not_found');
            return this._mapper.map(user, UserEntity, UserDto);
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    public async getUsersById(users: string[]): Promise<UserEntity[]> {
        try {
            const usersId = users.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            });
            const result = this._userRepository
                .createQueryBuilder('user')
                .where('user.id IN (:...usersId)', {
                    usersId: usersId,
                })
                .getMany();
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
