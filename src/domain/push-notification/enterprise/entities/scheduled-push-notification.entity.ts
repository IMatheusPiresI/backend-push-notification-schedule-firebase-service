import { NotificationStatus } from '@prisma/client';
import { randomUUID, UUID } from 'crypto';

export interface PushNotificationProps {
  id: string;
  title: string;
  body: string;
  scheduledAt: Date;
  topic: string;
  status?: NotificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PushNotification {
  constructor(private readonly props: PushNotificationProps) {}

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  set title(value: string) {
    this.props.title = value;
  }

  get body(): string {
    return this.props.body;
  }

  set body(value: string) {
    this.props.body = value;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  set scheduledAt(value: Date) {
    this.props.scheduledAt = value;
  }

  get topic(): string {
    return this.props.topic;
  }

  set topic(value: string) {
    this.props.topic = value;
  }

  get status(): NotificationStatus {
    return this.props.status ?? NotificationStatus.PENDING;
  }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date();
  }

  set createdAt(value: Date) {
    this.props.createdAt = value;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  static create(
    props: Omit<PushNotificationProps, 'id'>,
    id?: UUID,
  ): PushNotification {
    const now = new Date();
    return new PushNotification({
      ...props,
      id: id ?? randomUUID().toString(),
      createdAt: props?.createdAt ?? now,
      updatedAt: props?.updatedAt ?? now,
    });
  }

  static fromProps(props: PushNotificationProps): PushNotification {
    return new PushNotification(props);
  }
}
