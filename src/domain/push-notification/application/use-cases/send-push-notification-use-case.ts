import { Injectable, Logger } from '@nestjs/common';
import { Result, success, error } from '@/core/result';
import { SendPushNotificationGenericError } from './errors/send-push-notification-generic-error';
import { FirebaseMessagingError } from 'firebase-admin/messaging';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class SendPushNotificationUseCase {
  private readonly logger = new Logger(SendPushNotificationUseCase.name);
  constructor(private readonly notificationService: NotificationService) {}

  async execute(
    title: string,
    body: string,
  ): Promise<Result<SendPushNotificationGenericError, void>> {
    try {
      await this.notificationService.sendPushNotification(title, body);

      this.logger.log(`Push notification sent: ${title}`);
      return success();
    } catch (err) {
      this.logger.error(`Failed to send push notification: ${title}`);
      if (err instanceof FirebaseMessagingError) {
        return error(new SendPushNotificationGenericError(err.message));
      }

      return error(
        new SendPushNotificationGenericError(
          (err as Error)?.message || 'Unknown error',
        ),
      );
    }
  }
}
