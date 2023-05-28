/* eslint-disable simple-import-sort/imports */
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../common/base.controller';

import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';

import { FamilyService } from '../services/family.service';

@Controller('family')
@ApiTags('family')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FamilyController extends BaseController {
    constructor(private readonly _userService: FamilyService) {
        super();
    }

    /* Method GET */
    // @ApiOperation({ summary: 'Get profile' })
    // @Get('/profile')
    // @Version('1')
    // @HttpCode(HttpStatus.OK)
    // public async getProfile(@User() user): Promise<UserDto> {
    //     return await this._userService.getById(user.id);
    // }
}
