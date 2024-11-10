import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', async () => {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    jwtSigningKey: process.env.JWT_SIGNING_KEY,
  };
});
