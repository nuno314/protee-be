import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards,
    Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '../../../decorators/customer.decorator';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';
import { ProfileDto } from '../dto/response/profile.dto';
import { SystemUserService } from '../services/system-users.service';

@Controller('system-user')
@ApiTags('system-user')
@ApiBearerAuth()
export class SystemUserController {
    constructor(private readonly systemUserService: SystemUserService) {}

    @ApiOperation({ summary: 'Get system user profile' })
    @Get('/profile')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    public async getProfile(@User() user): Promise<ProfileDto> {
        return await this.systemUserService.getProfile(user.id);
    }
}
