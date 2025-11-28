import { Injectable, OnModuleInit } from '@nestjs/common';
import { ScheduledPushNotificationRepository } from '@/domain/push-notification/application/repositories/scheduled-push-notification.respository';
import { RegisterCronJobSchedulePushNotificationUseCase } from '@/domain/push-notification/application/use-cases/register-cron-job-schedule-push-notification-use-case';

@Injectable()
export class SchedulerInitService implements OnModuleInit {
  constructor(
    private readonly scheduledPushNotificationRepository: ScheduledPushNotificationRepository,
    private readonly registerCronJobUseCase: RegisterCronJobSchedulePushNotificationUseCase,
  ) {}

  async onModuleInit() {
    const allPendingNotifications =
      await this.scheduledPushNotificationRepository.findAllPendingAndScheduledAtInTheFuture();

    if (allPendingNotifications.length > 0) {
      await this.registerCronJobUseCase.execute();
    }
  }
}
