import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../../../shared/services/logger.service';
import { FamilyEntity } from '../entities/family.entity';

@Injectable()
export class FamilyService {
    constructor(
        @Inject(REQUEST) private readonly _req,
        @InjectRepository(FamilyEntity)
        private readonly _familyRepository: Repository<FamilyEntity>,
        @InjectMapper() private readonly _mapper: Mapper,
        private readonly _logger: LoggerService
    ) {}
}
