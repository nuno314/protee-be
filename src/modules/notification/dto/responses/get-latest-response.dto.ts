import { NotificationDto } from '../notification.dto';

export class GetLatestNotificationResponse {
    notifications: NotificationDto[];
    totalUnread: number;
}
