import { Injectable } from '@nestjs/common';
import { Result, success, error } from '@/core/result';
import { PushNotification } from '../../enterprise/entities/scheduled-push-notification.entity';
import { ScheduledPushNotificationRepository } from '../repositories/scheduled-push-notification.respository';

interface SchedulePushNotificationRequest {
  title: string;
  body: string;
  scheduledAt: Date;
  topic: string;
}

type SchedulePushNotificationResponse = Result<
  Error,
  {
    notification: PushNotification;
  }
>;

@Injectable()
export class SchedulePushNotificationUseCase {
  constructor(
    private readonly scheduledPushNotificationRepository: ScheduledPushNotificationRepository,
  ) {}

  async execute(
    body: SchedulePushNotificationRequest,
  ): Promise<SchedulePushNotificationResponse> {
    const scheduledPushNotification = PushNotification.create({
      title: body.title,
      body: body.body,
      scheduledAt: body.scheduledAt,
      topic: body.topic,
    });

    try {
      await this.scheduledPushNotificationRepository.create(
        scheduledPushNotification,
      );

      return success({
        notification: scheduledPushNotification,
      });
    } catch (err) {
      return error(
        new Error(
          (err as Error)?.message || 'Failed to schedule push notification',
        ),
      );
    }
  }
}
