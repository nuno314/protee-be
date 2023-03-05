import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { IUserPayload } from '../shared/interfaces/user';

export const User = createParamDecorator((data: string, ctx: ExecutionContext): IUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user ? request.user : null;
    if (!user) {
        return null;
    }
    return data ? user[data] : user;
});
