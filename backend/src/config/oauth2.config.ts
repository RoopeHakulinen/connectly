import { registerAs } from '@nestjs/config';

export const oauth2Config = registerAs('oauth2', async () => {
  return {
    authorizationUrl: process.env.AUTHORIZATION_URL,
    tokenUrl: process.env.TOKEN_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: `${process.env.DOMAIN}/api/oauth2/callback`,
  };
});
