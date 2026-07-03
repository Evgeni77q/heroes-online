export default () => ({
  port: Number(process.env.BACKEND_PORT) || 8080,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
  tickIntervalMs: Number(process.env.TICK_INTERVAL_MS) || 10_000,
  gameLoopTickMs: Number(process.env.GAME_LOOP_TICK_MS) || 10_000,
  accountAutoActivate: process.env.ACCOUNT_AUTO_ACTIVATE === 'true',
  gameSmokeFastBuild: process.env.GAME_SMOKE_FAST_BUILD === 'true',
});
