import { SchedulerService } from '@/infra/scheduler/scheduler.service';
import { SchedulerNames } from '@/core/entities/scheduler.entity';
import { Injectable, Logger } from '@nestjs/common';
import { Result, success } from '@/core/result';
import { SendPushNotificationUseCase } from './send-push-notification-use-case';
import { ScheduledPushNotificationRepository } from '../repositories/scheduled-push-notification.respository';
import { NotificationStatus } from '@prisma/client';

type RegisterCronJobSchedulePushNotificationResponse = Result<Error, void>;

@Injectable()
export class RegisterCronJobSchedulePushNotificationUseCase {
  private readonly CRON_EXPRESSION = '0 0 * * * *';
  private readonly logger = new Logger(
    RegisterCronJobSchedulePushNotificationUseCase.name,
  );
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly sendPushNotificationUseCase: SendPushNotificationUseCase,
    private readonly scheduledPushNotificationRepository: ScheduledPushNotificationRepository,
  ) {}

  async execute(): Promise<RegisterCronJobSchedulePushNotificationResponse> {
    const cronJobs = this.schedulerService.getAllCronJobs();
    if (
      cronJobs.some(
        (job) => job.name === SchedulerNames.SCHEDULED_PUSH_NOTIFICATION,
      )
    ) {
      this.logger.log(
        `Cron job ${SchedulerNames.SCHEDULED_PUSH_NOTIFICATION} already registered`,
      );
      return success();
    }

    this.schedulerService.addCronJob({
      name: SchedulerNames.SCHEDULED_PUSH_NOTIFICATION,
      cronExpression: this.CRON_EXPRESSION,
      cronAction: async () => {
        const ONE_HOUR_IN_MILLISECONDS = 1000 * 60 * 60;
        const scheduledPushNotifications =
          await this.scheduledPushNotificationRepository.findAllPending();

        if (scheduledPushNotifications.length === 0) {
          this.schedulerService.stopCronJob(
            SchedulerNames.SCHEDULED_PUSH_NOTIFICATION,
          );
          return;
        }
        for (const scheduledPushNotification of scheduledPushNotifications) {
          const scheduledAt = scheduledPushNotification.scheduledAt;
          const currentDate = new Date();
          if (
            scheduledAt.getTime() <= currentDate.getTime() &&
            scheduledAt.getTime() >=
              currentDate.getTime() - ONE_HOUR_IN_MILLISECONDS
          ) {
            const result = await this.sendPushNotificationUseCase.execute(
              scheduledPushNotification.topic,
              scheduledPushNotification.title,
              scheduledPushNotification.body,
            );
            if (result.isSuccess()) {
              await this.scheduledPushNotificationRepository.updateStatus(
                scheduledPushNotification.id,
                NotificationStatus.SENT,
              );
            } else {
              await this.scheduledPushNotificationRepository.updateStatus(
                scheduledPushNotification.id,
                NotificationStatus.FAILED,
              );
            }
          }
        }
      },
    });

    this.schedulerService.startCronJob(
      SchedulerNames.SCHEDULED_PUSH_NOTIFICATION,
    );

    return success();
  }
}
