import { DataSource } from 'typeorm';

export async function up(dataSource: DataSource) {
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS user_ratings (
      user_id INT NOT NULL,
      movie_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 0 AND rating <= 5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, movie_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
    )
  `);
}

export async function down(dataSource: DataSource) {
  await dataSource.query('DROP TABLE IF EXISTS user_ratings');
}
