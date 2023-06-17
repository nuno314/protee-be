import { Injectable } from '@nestjs/common';
import { Client } from 'onesignal-node';

@Injectable()
export class OneSignalService {
    private client: Client;

    constructor() {
        this.client = new Client('YOUR_APP_ID', 'YOUR_APP_AUTH_KEY');
    }

    async sendNotificationToIOS(deviceId: string, title: string, message: string): Promise<void> {
        const notification = {
            contents: { en: message },
            headings: { en: title },
            include_player_ids: [deviceId],
            ios_badgeType: 'Increase',
            ios_badgeCount: 1,
            app_id: 'YOUR_APP_ID',
        };

        try {
            await this.client.createNotification(notification);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
}
