import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma.service';
import { webpush } from './web-push.config';

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  data?: Record<string, unknown>;
}

interface SubscriptionKeys {
  p256dh: string;
  auth: string;
}

interface SubscriptionData {
  endpoint: string;
  keys: SubscriptionKeys;
}

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger(PushService.name);
  private vapidPublicKey: string | undefined;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
  }

  onModuleInit() {
    this.vapidPublicKey = this.configService.get<string>('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = this.configService.get<string>('VAPID_PRIVATE_KEY');
    const vapidContactEmail = 'mailto:admin@myconnectlyapp.com';

    if (this.vapidPublicKey && vapidPrivateKey) {
      webpush.setVapidDetails(
        vapidContactEmail,
        this.vapidPublicKey,
        vapidPrivateKey,
      );
      this.logger.log('VAPID credentials configured');
    } else {
      this.logger.warn('VAPID credentials not configured - push notifications disabled');
    }
  }

  getPublicKey(): string | undefined {
    return this.vapidPublicKey;
  }

  async subscribe(userId: number, subscription: SubscriptionData) {
    return this.prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        updatedAt: new Date(),
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
  }

  async unsubscribe(endpoint: string) {
    return this.prisma.pushSubscription
      .delete({
        where: { endpoint },
      })
      .catch(() => null);
  }

  async sendToUser(userId: number, payload: PushPayload) {
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      this.logger.warn(`No push subscriptions for user ${userId}`);
      return { sent: 0, failed: 0 };
    }

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
        sent++;
      } catch (error) {
        failed++;
        this.logger.error(`Push failed for ${sub.endpoint}: ${error.message}`);

        if (error.statusCode === 404 || error.statusCode === 410) {
          await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
          this.logger.log(`Removed invalid subscription ${sub.id}`);
        }
      }
    }

    this.logger.log(
      `Sent ${sent}/${subscriptions.length} notifications to user ${userId}`,
    );
    return { sent, failed };
  }
}
