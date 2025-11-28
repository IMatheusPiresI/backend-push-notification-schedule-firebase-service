import { Module } from '@nestjs/common';
import { SendPushNotificationController } from './controllers/send-push-notification.controller';
import { FirebaseModule } from '../gateways/firebase/firebase.module';
import { SendPushNotificationUseCase } from '@/domain/push-notification/application/use-cases/send-push-notification-use-case';
import { DatabaseModule } from '../database/database.module';
import { SchedulePushNotificationController } from './controllers/schedule-push-notification.controller';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { RegisterCronJobSchedulePushNotificationUseCase } from '@/domain/push-notification/application/use-cases/register-cron-job-schedule-push-notification-use-case';
import { SchedulePushNotificationUseCase } from '@/domain/push-notification/application/use-cases/schedule-push-notification-use-case';

@Module({
  imports: [FirebaseModule, DatabaseModule, SchedulerModule],
  controllers: [
    SendPushNotificationController,
    SchedulePushNotificationController,
  ],
  providers: [
    SendPushNotificationUseCase,
    SchedulePushNotificationUseCase,
    RegisterCronJobSchedulePushNotificationUseCase,
  ],
  exports: [RegisterCronJobSchedulePushNotificationUseCase, DatabaseModule],
})
export class HttpModule {}
