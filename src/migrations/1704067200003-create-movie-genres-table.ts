import { DataSource } from 'typeorm';

export async function up(dataSource: DataSource) {
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS movie_genres (
      movie_id INT NOT NULL,
      genre_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (movie_id, genre_id),
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
    )
  `);
}

export async function down(dataSource: DataSource) {
  await dataSource.query('DROP TABLE IF EXISTS movie_genres');
}
