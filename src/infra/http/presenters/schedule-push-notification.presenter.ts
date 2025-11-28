import { PushNotification } from '@/domain/push-notification/enterprise/entities/scheduled-push-notification.entity';

export class SchedulePushNotificationPresenter {
  static toHTTP(schedulePushNotification: PushNotification) {
    return {
      id: schedulePushNotification.id,
      title: schedulePushNotification.title,
      body: schedulePushNotification.body,
      scheduledAt: schedulePushNotification.scheduledAt,
      topic: schedulePushNotification.topic,
      status: schedulePushNotification.status,
    };
  }
}
