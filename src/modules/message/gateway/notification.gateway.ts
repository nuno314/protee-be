import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class NotificationGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;
    onModuleInit() {
        this.server.on('connectNoti', (socket) => {
            console.log('Connect....');
        });
    }
    @SubscribeMessage('createNotification')
    async createNotification(@MessageBody() message: any) {
        this.server.emit('message', message);
    }
}
