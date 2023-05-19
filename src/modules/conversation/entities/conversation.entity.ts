import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { MessageEntity } from '../../message/entities/message.entity';

@Entity({ synchronize: false, name: 'conversation' })
export class ConversationEntity extends AbstractEntity {
    @Column()
    userId: string;

    @Column()
    receiver: string;

    @OneToMany(() => MessageEntity, (message) => message.chat)
    message?: MessageEntity[];
}
