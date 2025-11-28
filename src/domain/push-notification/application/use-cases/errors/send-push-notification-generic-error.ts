import { UseCaseError } from '@/core/errors/use-case-error';

export class SendPushNotificationGenericError
  extends Error
  implements UseCaseError
{
  constructor(message?: string) {
    super(`Failed to send push notification: ${message}`);
  }
}
