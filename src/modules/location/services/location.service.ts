import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CityEntity, DistrictEntity, WardEntity } from '../../../common/entities';
import { SeederService } from '../../../seeder/seeder.service';
import { UtilsService } from '../../../shared/services/utils.service';

@Injectable()
export class LocationService {
    constructor(
        private _seederService: SeederService,
    ) {}

    // public async getCities(): Promise<CityEntity[]> {
    //     let result = await this._cacheService.getCities();
    //     if (!result?.length) {
    //         await this.seedLocation();
    //         result = await this._cacheService.getCities();
    //     }
    //     return result;
    // }

    // public async getDistricts(cityId: string): Promise<DistrictEntity[]> {
    //     let result = await this._cacheService.getDistricts(cityId);
    //     if (!result?.length) {
    //         await this.seedLocation();
    //         result = await this._cacheService.getDistricts(cityId);
    //     }
    //     return result;
    // }

    // public async getWards(districtId: string): Promise<WardEntity[]> {
    //     let result = await this._cacheService.getWards(districtId);
    //     if (!result?.length) {
    //         await this.seedLocation();
    //         result = await this._cacheService.getWards(districtId);
    //     }
    //     return result;
    // }

    // public async seedLocation(): Promise<void> {
    //     await this._seederService.seedLocations();
    // }
}
