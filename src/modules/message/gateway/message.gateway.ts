import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessageEntity } from '../entities/message.entity';
import { MessageService } from '../services/message.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class MessageGateway implements OnGatewayInit {
    constructor(private _messageService: MessageService) {}

    @WebSocketServer() server: Server;

    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, payload: MessageEntity): Promise<void> {
        // await this._messageService.createMessage(payload);
        this.server.emit('recMessage', payload);
    }

    afterInit(server: Server) {
        console.log(server);
        //Do stuffs
    }
}
