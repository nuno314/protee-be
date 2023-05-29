import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { CreateMessageDto } from '../dto/create-message.dto';

@WebSocketGateway({
    cors: {
        origin: ['http://localhost:3000'],
    },
})
export class ChatGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log('Connected');
        });
    }

    @SubscribeMessage('createMessage')
    async createMessage(@MessageBody() message: CreateMessageDto) {
        console.log(message);
        this.server.emit('messageFromServer', message);
    }
}
