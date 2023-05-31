import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BaseController } from '../../../common/base.controller';
import { User } from '../../../decorators/customer.decorator';
import { FirebaseAuthGuard } from '../../../guards/firebase.guard';
import { RecaptchaGuard } from '../../../guards/recaptcha.guard';
import { UserDto } from '../../users/dtos/domains/user.dto';
import { SocialRegisterDto } from '../../users/dtos/requests/social-register.dto';
import { ForgotPasswordDto } from '../dtos/requests/forgot-password.dto';
import { SystemUserLoginDto } from '../dtos/requests/login.dto';
import { ResetPasswordDto } from '../dtos/requests/reset-password.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @ApiOperation({ summary: 'Login social user by facebook or google' })
    @Post('user/social-login')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(FirebaseAuthGuard)
    public async loginSocial(@User() user): Promise<{ accessToken: string }> {
        return await this.authService.socialLogin(user.uid);
    }
    @ApiOperation({ summary: 'Test Only' })
    @Post('user/fake-login')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async fakeLogin(@Body() body: { id: string }): Promise<{ accessToken: string }> {
        return await this.authService.loginById(body.id);
    }

    @ApiOperation({ summary: 'Register social user by facebook or google' })
    @Post('user/social-register')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(FirebaseAuthGuard)
    public async registerSocial(@User() user): Promise<{ accessToken: string; refreshToken: string; user: UserDto }> {
        return await this.authService.socialLogin(user.uid, user.name);
    }

    @ApiOperation({ summary: 'Login system-user by email and password' })
    @Post('system-user/login')
    @Version('1')
    // @UseGuards(RecaptchaGuard)
    @HttpCode(HttpStatus.OK)
    public async loginSystemUser(@Body() request: SystemUserLoginDto): Promise<{ accessToken: string }> {
        return await this.authService.loginSystemUser(request.email, request.password);
    }

    @ApiOperation({ summary: 'Admin request reset password' })
    @Post('system-user/request-reset-password')
    @Version('1')
    // @UseGuards(RecaptchaGuard)
    @HttpCode(HttpStatus.OK)
    public async userRequestAdminResetPassword(@Body() request: ForgotPasswordDto): Promise<boolean> {
        return await this.authService.adminRequestResetPassword(request);
    }

    @ApiOperation({ summary: 'Admin reset password' })
    @Post('system-user/reset-password')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    public async userResetAdminPassword(@Body() request: ResetPasswordDto): Promise<boolean> {
        return await this.authService.adminResetPassword(request);
    }
}
