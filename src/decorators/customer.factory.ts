import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class CustomerProvider {
    //TODO:Refactor type later
    get customer(): any {
        return this.req.user;
    }

    constructor(@Inject(REQUEST) private readonly req) {}
}
