import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LocationService } from '../services/location.service';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private readonly _locationService: LocationService) {}
}
