import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { Messaging } from 'firebase-admin/messaging';
import { ConfigService } from '@nestjs/config';
import { FirebaseModuleNotInitializedError } from './errors/firebase-module-not-initialized';
import { FirebaseCredentialNotProvidedError } from './errors/firebase-crendential-not-provided';
import { NotificationService } from '@/domain/push-notification/application/services/notification.service';

@Injectable()
export class FirebaseNotificationGateway
  extends NotificationService
  implements OnModuleInit
{
  private app: App | null = null;
  private messaging: Messaging | null = null;

  constructor(private readonly config: ConfigService) {
    super();
  }

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    const serviceAccountBase64 = this.config.get<string>(
      'FIREBASE_SERVICE_ACCOUNT_BASE64',
    );

    if (!serviceAccountBase64) {
      throw new FirebaseCredentialNotProvidedError();
    }

    const serviceAccountJson = Buffer.from(
      serviceAccountBase64,
      'base64',
    ).toString('utf8');
    const serviceAccount = JSON.parse(serviceAccountJson);

    this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.messaging = admin.messaging(this.app);
  }

  public getApp(): App {
    if (!this.app) {
      throw new FirebaseModuleNotInitializedError('app');
    }
    return this.app;
  }

  async sendPushNotification(title: string, body: string): Promise<void> {
    if (!this.messaging) {
      throw new FirebaseModuleNotInitializedError('messaging');
    }

    await this.messaging.send({
      topic: 'all-ios',
      notification: { title, body },
    });
  }
}
