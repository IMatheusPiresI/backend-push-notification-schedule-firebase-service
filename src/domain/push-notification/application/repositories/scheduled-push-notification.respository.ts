import { NotificationStatus } from '@prisma/client';
import { PushNotification } from '../../enterprise/entities/scheduled-push-notification.entity';

export abstract class ScheduledPushNotificationRepository {
  abstract create(scheduledPushNotification: PushNotification): Promise<void>;
  abstract findAll(): Promise<PushNotification[]>;
  abstract findAllPending(): Promise<PushNotification[]>;
  abstract findAllPendingAndScheduledAtInTheFuture(): Promise<
    PushNotification[]
  >;
  abstract updateStatus(id: string, status: NotificationStatus): Promise<void>;
}
