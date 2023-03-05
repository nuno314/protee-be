import { AuthService } from '../services/auth.service';
import { BaseController } from '../../../common/base.controller';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController extends BaseController {
    constructor(private readonly authService: AuthService) {
        super();
    }
}
