import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private http = inject(HttpClient);
  private swRegistration: ServiceWorkerRegistration | null = null;

  async initialize(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return;
    }

    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    if (!('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      const subscription =
        await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        console.log('Already subscribed to push');
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    return Notification.requestPermission();
  }

  async subscribe(): Promise<boolean> {
    if (!this.swRegistration) {
      console.error('Service Worker not registered');
      return false;
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      const { publicKey } = await firstValueFrom(
        this.http.get<{ publicKey: string }>('/api/push/vapid-public-key'),
      );

      if (!publicKey) {
        console.error('VAPID public key not configured on server');
        return false;
      }

      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey),
      });

      const subscriptionJson = subscription.toJSON();
      await firstValueFrom(
        this.http.post('/api/push/subscribe', {
          endpoint: subscriptionJson.endpoint,
          keys: subscriptionJson.keys,
        }),
      );

      console.log('Push subscription successful');
      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      const subscription =
        await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await firstValueFrom(
          this.http.delete('/api/push/unsubscribe', {
            body: { endpoint: subscription.endpoint },
          }),
        );

        await subscription.unsubscribe();
      }
      return true;
    } catch (error) {
      console.error('Unsubscribe failed:', error);
      return false;
    }
  }

  async isSubscribed(): Promise<boolean> {
    if (!this.swRegistration) return false;
    const subscription =
      await this.swRegistration.pushManager.getSubscription();
    return subscription !== null;
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const outputArray = new Uint8Array(buffer);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
