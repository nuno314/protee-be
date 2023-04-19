/* eslint-disable simple-import-sort/imports */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../common/base.controller';

import { User } from '../../../decorators/customer.decorator';

import { RolesGuard } from './../../../guards/role.guard';
import { JwtAuthGuard } from '../../../guards/jwt-auth.guard';

import { Roles } from './../../../decorators/role.decorator';
import { RolesEnum } from './../../../common/enums/roles.enum';

import { UsersService } from '../services/users.service';
import { PaginationResponseDto } from '../../../common/dto/pagination-response.dto';
import { UpdateAccountDto } from '../dtos/requests/update-account.dto';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { UserDto } from '../dtos/domains/user.dto';
import { PaginationRequestDto } from '../../../common/dto/pagination-request.dto';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController extends BaseController {
    constructor(private readonly _userService: UsersService) {
        super();
    }

    /* Method GET */
    @ApiOperation({ summary: 'Get profile' })
    @Get('/profile')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async getProfile(@User() user): Promise<UserDto> {
        return await this._userService.getById(user.id);
    }

    @ApiOperation({ summary: 'Get a user by id' })
    @Get('/:userId')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async getUserById(@Param('userId') id: string): Promise<UserDto> {
        return await this._userService.getById(id);
    }

    @ApiOperation({ summary: 'Get users' })
    @Get()
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async getUsers(@Query() params: PaginationRequestDto): Promise<PaginationResponseDto<UserDto>> {
        return await this._userService.getPagedList(params);
    }

    @ApiOperation({ summary: 'Update profile' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update a profile'
    })
    @Put('/profile')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async updateAccount(@User() user, @Body() body: UpdateAccountDto): Promise<boolean> {
        return await this._userService.updateProfile(user.id, body);
    }

    @ApiOperation({ summary: 'Update a customer' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Update customer'
    })
    @Put('/')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(RolesGuard)
    @Roles(RolesEnum.ADMIN)
    public async updateUser(@Body() body: UpdateUserDto): Promise<boolean> {
        return await this._userService.update(body);
    }
}
