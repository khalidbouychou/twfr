
# Variables
COMPOSE = docker-compose -f docker-compose.yml

# Build all services
build:
	$(COMPOSE) build

# Start all services
up:
	$(COMPOSE) up

# Stop all services
down:
	$(COMPOSE) down

# Rebuild and start
rebuild:
	$(COMPOSE) up --build -d

# View logs
logs:
	$(COMPOSE) logs -f

# Stop containers and remove volumes
clean:
	$(COMPOSE) down -v

# Run a command in the backend container
backend:
	$(COMPOSE) exec backend sh

# Run a command in the frontend container
frontend:
	$(COMPOSE) exec frontend sh

# Run a MySQL shell
mysql:
	$(COMPOSE) exec mysql mysql -umyuser -pmypassword mydb
