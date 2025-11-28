import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PushNotification } from '@/domain/push-notification/enterprise/entities/scheduled-push-notification.entity';
import { PrismaScheduledPushNotificationMapper } from '../mappers/prisma-scheduled-push-notification.mapper';
import { ScheduledPushNotificationRepository } from '@/domain/push-notification/application/repositories/scheduled-push-notification.respository';
import { NotificationStatus } from '@prisma/client';

@Injectable()
export class PrismaScheduledPushNotificationRepository
  implements ScheduledPushNotificationRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(scheduledPushNotification: PushNotification): Promise<void> {
    const data = PrismaScheduledPushNotificationMapper.toPrisma(
      scheduledPushNotification,
    );

    await this.prisma.notificationScheduled.create({
      data,
    });
  }

  async findAll(): Promise<PushNotification[]> {
    const scheduledNotifications =
      await this.prisma.notificationScheduled.findMany({
        orderBy: {
          scheduledAt: 'asc',
        },
      });

    return scheduledNotifications.map((notification) =>
      PrismaScheduledPushNotificationMapper.toDomain(notification),
    );
  }

  async findAllPending(): Promise<PushNotification[]> {
    const scheduledNotifications =
      await this.prisma.notificationScheduled.findMany({
        where: {
          status: NotificationStatus.PENDING,
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      });

    return scheduledNotifications.map((notification) =>
      PrismaScheduledPushNotificationMapper.toDomain(notification),
    );
  }

  async findAllPendingAndScheduledAtInTheFuture(): Promise<PushNotification[]> {
    const scheduledNotifications =
      await this.prisma.notificationScheduled.findMany({
        where: {
          status: NotificationStatus.PENDING,
          scheduledAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          scheduledAt: 'asc',
        },
      });

    return scheduledNotifications.map((notification) =>
      PrismaScheduledPushNotificationMapper.toDomain(notification),
    );
  }

  async updateStatus(id: string, status: NotificationStatus): Promise<void> {
    await this.prisma.notificationScheduled.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
  }
}
