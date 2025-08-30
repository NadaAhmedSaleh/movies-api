<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
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
