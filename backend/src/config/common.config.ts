import { registerAs } from '@nestjs/config';

export const commonConfig = registerAs('common', async () => {
  return {
    appUrl: process.env.APP_URL,
  };
});
