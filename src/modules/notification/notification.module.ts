import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../../shared/shared.module';
import { FamilyModule } from '../family/family.module';
import { MessageModule } from '../message/message.module';
import { NotificationController } from './controllers/notification.controller';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationProfile } from './notification.profile';
import { NotificationService } from './services/notification.service';

const services = [NotificationProfile, NotificationService];
const controllers = [NotificationController];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity]), SharedModule, MessageModule, forwardRef(() => FamilyModule)],
    controllers: controllers,
    providers: [...services],
    exports: [...services],
})
export class NotificationModule {}
