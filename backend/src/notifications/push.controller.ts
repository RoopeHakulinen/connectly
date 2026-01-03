import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { PushService } from './push.service';

interface SubscribeDto {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface UnsubscribeDto {
  endpoint: string;
}

@Controller('push')
export class PushController {
  constructor(private pushService: PushService) {
  }

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return { publicKey: this.pushService.getPublicKey() };
  }

  @Post('subscribe')
  async subscribe(@Req() req, @Body() body: SubscribeDto) {
    return this.pushService.subscribe(req.user.id, body);
  }

  @Delete('unsubscribe')
  async unsubscribe(@Body() body: UnsubscribeDto) {
    return this.pushService.unsubscribe(body.endpoint);
  }
}
