export abstract class NotificationService {
  abstract sendPushNotification(title: string, body: string): Promise<void>;
}
