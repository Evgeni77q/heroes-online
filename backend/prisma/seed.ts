import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { WorldBootstrapService } from '../src/world/world-bootstrap.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const bootstrap = app.get(WorldBootstrapService);
    const { world, map } = await bootstrap.ensureStarterWorld();

    console.log(`[seed] world: ${world.name} (${world.id})`);
    console.log(`[seed] map: ${map.width}x${map.height} (${map.id})`);
    console.log('[seed] done');
  } finally {
    await app.close();
  }
}

main().catch((error) => {
  console.error('[seed] failed:', error);
  process.exit(1);
});
