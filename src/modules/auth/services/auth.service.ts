import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';

import { AppConfigService } from '../../../shared/services/app-config.service';
import { MailService } from '../../../shared/services/mail.service';
import { OtpService } from '../../../shared/services/otp.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { SystemUserEntity } from '../../system-users/entities/system-users.entity';
import { UserDto } from '../../users/dtos/domains/user.dto';
import { UserEntity } from '../../users/entities/users.entity';
import { ForgotPasswordDto } from '../dtos/requests/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/requests/reset-password.dto';
import { ResetPasswordRequestEntity } from '../entities/reset-password-request.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        @InjectRepository(SystemUserEntity)
        private readonly _systemUsersRepository: Repository<SystemUserEntity>,
        @InjectRepository(ResetPasswordRequestEntity)
        private readonly _resetPasswordRequestRepository: Repository<ResetPasswordRequestEntity>,
        private readonly jwtService: JwtService,
        private readonly _configService: AppConfigService,
        private readonly _mailService: MailService,
        @InjectMapper() private readonly _mapper: Mapper
    ) {}

    // For test only
    public async loginById(id: string): Promise<{ accessToken: string }> {
        try {
            const user = await this._userRepository.findOneBy({
                id,
            });

            if (!user) {
                throw new NotFoundException('user_not_found');
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            };

            return { accessToken: this.jwtService.sign(payload) };
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
    public async socialLogin(firebaseId: string, name?: string): Promise<{ accessToken: string; refreshToken: string; user: UserDto }> {
        try {
            const userExist = await this._userRepository.findOneBy({
                firebaseId: firebaseId,
            });
            let user = userExist;

            if (!user) {
                if (!name) throw new BadRequestException('missing_name');
                const userDto = {
                    name: name,
                    isActive: true,
                    firebaseId: firebaseId,
                };

                const userEntity = await this._userRepository.save(userDto);

                if (userEntity) {
                    user = userEntity;
                }
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
            };

            return {
                accessToken: this.jwtService.sign(payload),
                refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
                user: this._mapper.map(user, UserEntity, UserDto),
            };
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async loginSystemUser(email: string, password: string): Promise<{ accessToken: string }> {
        const user = await this._systemUsersRepository.findOneBy({ email });
        if (!user) {
            throw new BadRequestException('invalid_username_or_password');
        }
        const validPassword = await bcrypt.compareSync(password, user.password);

        if (!validPassword) throw new BadRequestException('invalid_username_or_password');

        const payload = {
            id: user.id,
            role: user.role,
            email: user.email,
        };

        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async adminRequestResetPassword(dto: ForgotPasswordDto): Promise<boolean> {
        try {
            if (!dto) {
                throw new BadRequestException();
            }

            // check latest request
            const latestRequest = await this._resetPasswordRequestRepository.findOneBy({ email: dto.email });
            if (latestRequest) {
                const latestRequestAt = new Date(latestRequest.updatedAt);
                const utcNow = UtilsService.getUtcNow();
                const dateDiff = await UtilsService.dateDiff(utcNow, latestRequestAt, 'second');
                if (dateDiff < (parseInt(this._configService.get('APP_OTP_EXPIRED_IN')) | 300)) {
                    throw new BadRequestException('request_too_much_times');
                }
            }

            const user = await this._systemUsersRepository.findOneBy({ email: dto.email });
            if (!user) {
                throw new BadRequestException('invalid_user');
            }

            const secretKey = OtpService.generateSecret();
            const request: ResetPasswordRequestEntity = {
                email: user.email,
                key: secretKey,
                userId: user.id,
            };
            if (latestRequest) request.id = latestRequest.id;
            const cacheResult = await this._resetPasswordRequestRepository.save(request);
            if (!cacheResult) {
                throw new InternalServerErrorException();
            }

            const url = `${this._configService.get('PORTAL_URL')}/reset-password/${secretKey}`;
            this._mailService.sendResetPassword(user.email, url);
            return true;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async adminResetPassword(dto: ResetPasswordDto): Promise<boolean> {
        try {
            const request = await this._resetPasswordRequestRepository.findOneBy({ key: dto.secretKey });
            if (!request) {
                throw new BadRequestException('request_reset_invalid_or_out_of_date');
            }

            // check latest request
            const latestRequestAt = new Date(request.updatedAt);
            const utcNow = UtilsService.getUtcNow();
            const dateDiff = await UtilsService.dateDiff(utcNow, latestRequestAt, 'second');
            if (dateDiff > (parseInt(this._configService.get('APP_OTP_EXPIRED_IN')) | 300)) {
                throw new BadRequestException('request_reset_invalid_or_out_of_date');
            }

            const user = await this._systemUsersRepository.findOneBy({ email: request.email });
            if (!user) {
                throw new BadRequestException('invalid_user');
            }

            request.key = '';
            await this._resetPasswordRequestRepository.save(request);
            return await this._updateAdminPassword(request.userId, dto.newPassword);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    private async _updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
        const systemUser = await this._systemUsersRepository.findOneBy({ id: id });
        if (!systemUser) {
            return false;
        }
        systemUser.password = bcrypt.hashSync(newPassword);
        const result = await this._systemUsersRepository.save(systemUser);
        return !!result;
    }
}
