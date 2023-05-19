import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { ConversationEntity } from '../../conversation/entities/conversation.entity';

@Entity({ synchronize: false, name: 'message' })
export class MessageEntity extends AbstractEntity {
    @Column({ type: 'uuid' })
    sender: string;

    @Column({ type: 'uuid' })
    receiver: string;

    @Column({ nullable: true, default: false })
    isSeen: boolean;

    @Column()
    content: string;

    @Column({ type: 'uuid' })
    conversation_id: string;

    @ManyToOne(() => ConversationEntity, (conversation) => conversation.message)
    @JoinColumn({ name: 'conversation_id' })
    chat: ConversationEntity;
}
