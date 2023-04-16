import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/users.entity';
import { UsersService } from './services/users.service';

@Module({
    imports: [SharedModule, TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UsersService],
    exports: [UsersService, TypeOrmModule.forFeature([UserEntity])]
})
export class UsersModule {}
