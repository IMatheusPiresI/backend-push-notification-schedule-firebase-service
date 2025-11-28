import { PushNotification } from '@/domain/push-notification/enterprise/entities/scheduled-push-notification.entity';
import { NotificationScheduled, Prisma } from '@prisma/client';

export class PrismaScheduledPushNotificationMapper {
  static toDomain(raw: NotificationScheduled): PushNotification {
    return new PushNotification({
      id: raw.id,
      title: raw.title,
      body: raw.body,
      scheduledAt: raw.scheduledAt,
      topic: raw.topic,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
  static toPrisma(
    notification: PushNotification,
  ): Prisma.NotificationScheduledCreateInput {
    return {
      title: notification.title,
      body: notification.body,
      scheduledAt: notification.scheduledAt,
      topic: notification.topic,
    };
  }
}
