import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../config/logger.config';
import { dataSourceConfig } from '../config/database.config';

export class MigrationRunner {
  private dataSource: DataSource;
  private migrationsDir = path.join(__dirname);

  constructor() {
    this.dataSource = new DataSource(dataSourceConfig);
  }

  async initialize() {
    await this.dataSource.initialize();
  }

  async createMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await this.dataSource.query(query);
  }

  async getExecutedMigrations(): Promise<string[]> {
    const result = await this.dataSource.query('SELECT name FROM migrations');
    return result.map((row: any) => row.name);
  }

  async getMigrationFiles(): Promise<string[]> {
    const files = fs.readdirSync(this.migrationsDir);
    return files
      .filter((file) => file.endsWith('.ts') && 
        file !== 'MigrationRunner.ts' && 
        file !== 'run-migrations.ts' && 
        file !== 'generate-migration.ts')
      .sort();
  }

  async runMigration(migrationName: string) {
    logger.info(`Running migration: ${migrationName}`);

    const migrationPath = path.join(this.migrationsDir, migrationName);
    const migration = require(migrationPath);

    if (typeof migration.up === 'function') {
      await migration.up(this.dataSource);
      await this.dataSource.query('INSERT INTO migrations (name) VALUES (?)', [
        migrationName,
      ]);
      logger.info(`Migration ${migrationName} completed successfully`);
    } else {
      logger.warn(`Migration ${migrationName} has no 'up' function`);
    }
  }

  async runAllMigrations() {
    await this.initialize();
    await this.createMigrationsTable();

    const executedMigrations = await this.getExecutedMigrations();
    const migrationFiles = await this.getMigrationFiles();

    logger.info('Checking for pending migrations...');

    for (const migrationFile of migrationFiles) {
      if (!executedMigrations.includes(migrationFile)) {
        await this.runMigration(migrationFile);
      } else {
        logger.info(`Migration ${migrationFile} already executed, skipping`);
      }
    }

    logger.info('All migrations completed successfully');
    await this.dataSource.destroy();
  }
}
