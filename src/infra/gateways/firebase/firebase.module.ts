import { Module } from '@nestjs/common';
import { FirebaseNotificationGateway } from './firebase-notification.gateway';
import { NotificationService } from '@/domain/push-notification/application/services/notification.service';

@Module({
  providers: [
    {
      provide: NotificationService,
      useClass: FirebaseNotificationGateway,
    },
  ],
  exports: [NotificationService],
})
export class FirebaseModule {}
