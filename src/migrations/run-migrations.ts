import { MigrationRunner } from './MigrationRunner';
import { logger } from '../config/logger.config';

async function runMigrations() {
  const runner = new MigrationRunner();
  
  try {
    await runner.runAllMigrations();
  } catch (error) {
    logger.error('Migration failed:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

runMigrations();
