import { createApp } from './app';
import { env } from './env';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`🚀 AUTO API running on http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
});
