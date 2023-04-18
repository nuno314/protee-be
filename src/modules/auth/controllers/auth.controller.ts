import { AuthService } from '../services/auth.service';
import { BaseController } from '../../../common/base.controller';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseAuthGuard } from '../../../guards/firebase.guard';
import { User } from '../../../decorators/customer.decorator';
import { SocialRegisterDto } from '../../users/dtos/requests/social-register.dto';
import { RecaptchaGuard } from '../../../guards/recaptcha.guard';
import { SystemUserLoginDto } from '../dtos/requests/login.dto';

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

    @ApiOperation({ summary: 'Register social user by facebook or google' })
    @Post('user/social-register')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @UseGuards(FirebaseAuthGuard)
    public async registerSocial(
        @User() user,
        @Body() request: SocialRegisterDto,
    ): Promise<{ accessToken: string }> {
        return await this.authService.socialLogin(user.uid, request.name);
    }

    @ApiOperation({ summary: 'Login system-user by email and password' })
    @Post('system-user/login')
    @Version('1')
    // @UseGuards(RecaptchaGuard)
    @HttpCode(HttpStatus.OK)
    public async loginSystemUser(@Body() request: SystemUserLoginDto): Promise<{ accessToken: string }> {
        return await this.authService.loginSystemUser(request.email, request.password);
    }
}
