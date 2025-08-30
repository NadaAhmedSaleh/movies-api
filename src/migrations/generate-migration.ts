import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../config/logger.config';

function generateMigration() {
  const migrationName = process.argv[2];

  if (!migrationName) {
    logger.error('Please provide a migration name: npm run migration:generate <migration-name>');
    process.exit(1);
  }

  const timestamp = Date.now();
  const fileName = `${timestamp}-${migrationName}.ts`;
  const filePath = path.join(__dirname, fileName);

  const migrationTemplate = `import { DataSource } from 'typeorm';

export async function up(dataSource: DataSource) {
  // Add your SQL migration code here
  // Example:
  // await dataSource.query(\`
  //   CREATE TABLE example_table (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     name VARCHAR(100) NOT NULL,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  //   )
  // \`);
}

export async function down(dataSource: DataSource) {
  // Add your rollback code here
  // Example:
  // await dataSource.query('DROP TABLE IF EXISTS example_table');
}
`;

  fs.writeFileSync(filePath, migrationTemplate);
  logger.info(`Migration file created successfully: ${fileName}`);
}

// Only run if this file is executed directly
if (require.main === module) {
  generateMigration();
}
