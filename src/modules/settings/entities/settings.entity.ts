import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { SettingsCodeEnum } from '../enums/settings-type.enum';

@Entity({ synchronize: true, name: 'settings' })
export class SettingsEntity extends AbstractEntity {
    @Column()
    code: SettingsCodeEnum;

    @Column({ type: 'jsonb', array: false, default: () => "'{}'" })
    data: any;
}
