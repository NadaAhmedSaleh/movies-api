# Movie API

A RESTful API for managing movies, user ratings, and watch lists built with NestJS and TypeORM.

## Technologies Used

- **Backend Framework**: NestJS
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: class-validator & class-transformer
- **Caching**: Redis
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest

## Features

- User authentication (signup/login)
- Movie listing with filtering, sorting, and pagination
- User movie ratings (0-5 stars)
- User watch lists
- Redis caching for performance optimization
- Comprehensive input validation
- Unit testing

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login

### Movies
- `GET /movies` - List movies (public)
- `GET /movies/auth` - List movies with user context (authenticated)

### User Ratings
- `POST /ratings` - Add movie rating (authenticated)

### Watch List
- `POST /watchList` - Add movie to watch list (authenticated)

## Database Migrations

Migrations are automatically run using Docker Compose:

```bash
docker-compose up migrations
```

The migration process:
1. Creates database tables (users, movies, genres, etc.)
2. Seeds initial data from TMDB API
3. Establishes relationships between movies and genres

## Caching Implementation

Redis caching is implemented for the movie listing endpoint when sorting by rating:

- **Cache Key**: `all_movies`
- **Cache Duration**: 1 day (24 hours)
- **Use Case**: Rating sorting requires fetching all movies to calculate averages and sort in memory
- **Benefits**: 
  - Reduces database load for expensive rating-sorted queries
  - Improves response time for subsequent requests
  - Only caches when needed (rating sorting path)

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)

### Environment Variables
Create a `.env` file:
```env
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=movies-db
JWT_SECRET=your-jwt-secret
TMDB_TOKEN=your-tmdb-token
REDIS_HOST=redis
REDIS_PORT=6379
```

### Running the Application
```bash
# Start all services
docker-compose up --build

# The API will be available at http://localhost:8080
```

### Running Tests
```bash
npm test
```

## API Documentation

For detailed API documentation with examples and request/response schemas, please refer to the Postman collection:

**[Movie API Postman Collection](https://breadfast.postman.co/workspace/My-Workspace~df753f41-a2ea-4a22-8bbf-591641f3fb8e/collection/34022152-761e5ec8-e14f-44ff-adb3-4c9d94c373b9?action=share&creator=34022152&active-environment=34022152-57966f15-0bee-4b57-afaf-862187903cdc)**

The collection includes:
- Authentication endpoints documentation
- User ratings endpoints documentation  
- Watch list endpoints documentation
- Example requests and responses
- Environment variables setup
