import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

const baseConfig = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'movies-db',
};

export const databaseConfig: TypeOrmModuleOptions = {
  ...baseConfig,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: true,
};

export const dataSourceConfig: DataSourceOptions = {
  ...baseConfig,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
};
