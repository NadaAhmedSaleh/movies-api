# Docker Setup

## Quick Start
```bash
docker-compose up
```

This starts:
- MySQL database
- Runs migrations
- Starts NestJS app on http://localhost:8080

## Commands
```bash
# Start
docker-compose up

# Background
docker-compose up -d

# Stop
docker-compose down
```

## Services
- **App**: http://localhost:8080
- **MySQL**: localhost:3306
- **Database**: movies-db (root/rootpassword)
