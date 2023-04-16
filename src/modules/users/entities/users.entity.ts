import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';

@Entity({ synchronize: false, name: 'users' })
export class UserEntity extends AbstractEntity {
    @Column({ nullable: true })
    @AutoMap()
    name: string;

    @Column()
    @AutoMap()
    firebaseId: string;

    @AutoMap()
    @Column({ nullable: true })
    phoneNumber: string;

    @AutoMap()
    @Column({ nullable: true })
    email: string;

    @AutoMap()
    @Column({ default: true })
    isActive: boolean;

    @AutoMap()
    @Column({ nullable: true })
    dob: Date;
}
