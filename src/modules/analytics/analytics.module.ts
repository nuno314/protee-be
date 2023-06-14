import { Module } from '@nestjs/common';

import { SharedModule } from '../../shared/shared.module';
import { FamilyModule } from '../family/family.module';
import { LocationModule } from '../location/location.module';
import { UsersModule } from '../users/users.module';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics.service';

@Module({
    imports: [SharedModule, UsersModule, FamilyModule, LocationModule],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
    exports: [AnalyticsService],
})
export class AnalyticsModule {}
