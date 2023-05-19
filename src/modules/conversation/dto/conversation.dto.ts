import { AutoMap } from '@automapper/classes';

import { MessageDto } from '../../message/dto/message.dto';

export class ConversationDto {
    @AutoMap()
    id: string;

    @AutoMap()
    message: MessageDto[];
}
