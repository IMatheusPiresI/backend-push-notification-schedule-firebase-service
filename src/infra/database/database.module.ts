import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaScheduledPushNotificationRepository } from './prisma/repositories/prisma-scheduled-push-notification.repository';
import { ScheduledPushNotificationRepository } from '@/domain/push-notification/application/repositories/scheduled-push-notification.respository';

@Module({
  providers: [
    PrismaService,
    {
      provide: ScheduledPushNotificationRepository,
      useClass: PrismaScheduledPushNotificationRepository,
    },
  ],
  exports: [PrismaService, ScheduledPushNotificationRepository],
})
export class DatabaseModule {}
