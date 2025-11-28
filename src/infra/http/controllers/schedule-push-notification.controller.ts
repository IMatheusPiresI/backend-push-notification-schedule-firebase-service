import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod/v3';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { SchedulePushNotificationUseCase } from '@/domain/push-notification/application/use-cases/schedule-push-notification-use-case';
import { SchedulePushNotificationPresenter } from '../presenters/schedule-push-notification.presenter';
import { RegisterCronJobSchedulePushNotificationUseCase } from '@/domain/push-notification/application/use-cases/register-cron-job-schedule-push-notification-use-case';
import { ScheduledPushNotificationRepository } from '@/domain/push-notification/application/repositories/scheduled-push-notification.respository';

const schedulePushNotificationSchema = z.object({
  title: z.string(),
  body: z.string(),
  scheduledAt: z.coerce.date().refine(
    (date) => {
      const scheduledAt = date;

      const currentDate = new Date();

      return scheduledAt.getTime() > currentDate.getTime();
    },
    {
      message: 'A data de agendamento deve ser maior que a data atual',
    },
  ),
  topic: z.string(),
});

type SchedulePushNotificationDto = z.infer<
  typeof schedulePushNotificationSchema
>;

@Controller('/notification')
@UsePipes(new ZodValidationPipe(schedulePushNotificationSchema))
export class SchedulePushNotificationController {
  constructor(
    private readonly schedulePushNotificationUseCase: SchedulePushNotificationUseCase,
    private readonly registerCronJobSchedulePushNotificationUseCase: RegisterCronJobSchedulePushNotificationUseCase,
    private readonly scheduledPushNotificationRepository: ScheduledPushNotificationRepository,
  ) {}

  @Post('/schedule')
  async schedulePushNotification(@Body() body: SchedulePushNotificationDto) {
    const result = await this.schedulePushNotificationUseCase.execute(body);

    if (result.isSuccess()) {
      const notification = SchedulePushNotificationPresenter.toHTTP(
        result.value.notification,
      );

      this.registerCronJobSchedulePushNotificationUseCase.execute();

      return {
        notification,
      };
    }

    throw new BadRequestException(result.error.message);
  }

  @Get('/schedule')
  async getScheduledPushNotifications() {
    const scheduledPushNotifications =
      await this.scheduledPushNotificationRepository.findAll();
    const scheduledPushNotificationsPresenter = scheduledPushNotifications.map(
      (scheduledPushNotification) =>
        SchedulePushNotificationPresenter.toHTTP(scheduledPushNotification),
    );

    return scheduledPushNotificationsPresenter;
  }
}
