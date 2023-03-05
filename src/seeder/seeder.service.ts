import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DataSource, In, Repository } from 'typeorm';

import { CityEntity, DistrictEntity, WardEntity } from '../common/entities';
import { LoggerService } from '../shared/services/logger.service';
import { SeedPermissionDto } from './dtos/domains/seed-permission.dto';
import { SeedRolePermissionDto } from './dtos/domains/seed-role-permission.dto';
import { SeedSettingsDto } from './dtos/domains/seed-settings.dto';

import fs = require('fs');
import path = require('path');
import { RolesEnum } from '../common/enums/roles.enum';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        private readonly _dataSource: DataSource,
        private readonly _logger: LoggerService
    ) {}

    async onModuleInit() {}
    async seed() {}
}
