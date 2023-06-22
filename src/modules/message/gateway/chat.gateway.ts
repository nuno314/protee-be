import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { FamilyRoleEnum } from '../../family/enums/family-role.enum';

@WebSocketGateway({
    cors: {
        origin: '*',
        // credentials: true,
    },
    // path: '/messages',
    // transports: ['websocket', 'polling', 'flashsocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    constructor(private jwtService: JwtService) {
        console.log('Init NotificationGateway');
    }
    async handleConnection(socket: Socket): Promise<void> {
        try {
            const accessToken = this._getToken(socket);
            const familyId = this._getFamilyId(socket);
            const isVerify = await this.jwtService.verify(accessToken);
            if (!isVerify) {
                return this._disconnect(socket);
            }

            if (isVerify.role !== FamilyRoleEnum.Parent) {
                await socket.join(`parent_${familyId}`);
                await this.server.to(socket.id).emit('join', `Join Room: parent_${familyId}`);
            }

            this.server.to(socket.id).emit('join', 'connected to websocket');

            await socket.join(familyId);
            await this.server.to(socket.id).emit('join', `Join Room: ${familyId}`);
        } catch {
            return this._disconnect(socket);
        }
    }

    async emitNotification(noti: any, socketId: string = null): Promise<void> {
        if (socketId) {
            this.server.to(socketId).emit('notification', noti);
        } else {
            const clients = await this.server.allSockets();
            this.server.to([...clients]).emit('notification', noti);
        }
    }

    async emitNotificationToRoom(noti: any, room: string): Promise<void> {
        this.server.to(room).emit('notification', noti);
    }

    async emitWarningToRoom(noti: any, room: string): Promise<void> {
        this.server.to(room).emit('warning', noti);
    }

    handleDisconnect(socket: Socket): void {
        socket.disconnect();
    }

    private _disconnect(socket: Socket): void {
        socket.emit('Error', new UnauthorizedException());
        socket.disconnect();
    }

    async emitMessage(noti: any, socketId: string = null): Promise<void> {
        if (socketId) {
            this.server.to(socketId).emit('message', noti);
        } else {
            const clients = await this.server.allSockets();
            this.server.to([...clients]).emit('message', noti);
        }
    }

    async emitMessageToRoom(noti: any, room: string): Promise<void> {
        this.server.to(room).emit('message', noti);
    }

    private _getToken(socket: Socket): string | null {
        const token = socket.handshake.auth.token || (socket.handshake.query['accessToken'] as string);
        if (token) {
            return token;
        }
        return null;
    }

    private _getFamilyId(socket: Socket): string | null {
        const channelId = socket.handshake.query['familyId'] as string;
        if (channelId) {
            return channelId;
        }
        return null;
    }
}
