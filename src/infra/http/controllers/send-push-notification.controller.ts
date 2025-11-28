import { Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { SendPushNotificationUseCase } from '@/domain/push-notification/application/use-cases/send-push-notification-use-case';

@Controller('/notification')
export class SendPushNotificationController {
  constructor(
    private readonly sendPushNotificationUseCase: SendPushNotificationUseCase,
  ) {}

  @Post()
  async sendPushNotification() {
    try {
      await this.sendPushNotificationUseCase.execute(
        'Test Notification',
        'This is a test notification',
      );

      return {
        message: 'Push notification sent',
      };
    } catch {
      throw new InternalServerErrorException(
        'Failed to send push notification',
      );
    }
  }
}
