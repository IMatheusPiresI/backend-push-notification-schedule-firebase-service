export abstract class NotificationService {
  abstract sendPushNotification(
    topic: string,
    { title, body }: { title: string; body: string },
  ): Promise<void>;
}
