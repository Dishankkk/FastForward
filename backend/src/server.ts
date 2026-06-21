import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './api/app';
import { connectToDatabase } from './config/db';

async function bootstrap() {
  await connectToDatabase();

  const app = createApp();
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`[api] server process listening on port ${PORT}`);
  });
}

bootstrap();