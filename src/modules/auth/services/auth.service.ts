import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../../shared/services/logger.service';
import { SystemUserEntity } from '../../system-users/entities/system-users.entity';
import { UserEntity } from '../../users/entities/users.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly _userRepository: Repository<UserEntity>,
        @InjectRepository(SystemUserEntity)
        private readonly _systemUsersRepository: Repository<SystemUserEntity>,
        private readonly jwtService: JwtService,
        private readonly _logger: LoggerService
    ) {}
    public async socialLogin(
        firebaseId: string,
        name?: string
    ): Promise<{ accessToken: string }> {
        try {
            const userExist = await this._userRepository.findOneBy({
                firebaseId: firebaseId
            });
            let user = userExist;

            if (!user) {
                if (!name) throw new BadRequestException('missing_name');
                const userDto = {
                    name: name,
                    isActive: true,
                    firebaseId: firebaseId
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
                phoneNumber: user.phoneNumber
            };

            return { accessToken: this.jwtService.sign(payload)};
        } catch (err) {
            this._logger.error(err);
            throw err;
        }
    }

    async loginSystemUser(
        email: string,
        password: string
    ): Promise<{ accessToken: string }> {
        const user = await this._systemUsersRepository.findOneBy({ email });
        if (!user) {
            throw new BadRequestException('invalid_username_or_password');
        }
        const validPassword = await bcrypt.compareSync(password, user.password);

        if (!validPassword)
            throw new BadRequestException('invalid_username_or_password');

        const payload = {
            id: user.id,
            role: user.role,
            email: user.email
        };

        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
}
