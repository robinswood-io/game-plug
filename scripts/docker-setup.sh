#!/bin/bash
# =============================================================================
# Docker Compose Setup Script for Game-Plug
# =============================================================================
# This script automates the setup and management of Game-Plug services
# Usage: ./scripts/docker-setup.sh [command]
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Configuration
COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"
ENV_FILE="$PROJECT_DIR/.env"
ENV_EXAMPLE="$PROJECT_DIR/.env.example"

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo -e "\n${BLUE}===============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# =============================================================================
# Utility Functions
# =============================================================================

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        return 1
    fi
    print_success "Docker is installed"
    return 0
}

check_docker_compose() {
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        return 1
    fi
    print_success "Docker Compose is installed"
    return 0
}

check_env_file() {
    if [[ ! -f "$ENV_FILE" ]]; then
        print_warning "Environment file not found: $ENV_FILE"
        return 1
    fi
    print_success "Environment file found"
    return 0
}

check_compose_file() {
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        print_error "Docker Compose file not found: $COMPOSE_FILE"
        return 1
    fi
    print_success "Docker Compose file found"
    return 0
}

# =============================================================================
# Setup Commands
# =============================================================================

cmd_validate() {
    print_header "Validating Setup"

    local errors=0

    # Check Docker
    if ! check_docker; then
        ((errors++))
    fi

    # Check Docker Compose
    if ! check_docker_compose; then
        ((errors++))
    fi

    # Check files
    if ! check_compose_file; then
        ((errors++))
    fi

    if ! check_env_file; then
        print_warning "Creating .env from .env.example"
        if [[ -f "$ENV_EXAMPLE" ]]; then
            cp "$ENV_EXAMPLE" "$ENV_FILE"
            print_info "Created $ENV_FILE"
            print_warning "Please edit $ENV_FILE with your configuration"
            ((errors++))
        fi
    fi

    if [[ $errors -eq 0 ]]; then
        print_success "All validations passed!"
        return 0
    else
        print_error "Validation failed with $errors error(s)"
        return 1
    fi
}

cmd_setup() {
    print_header "Setting up Game-Plug"

    # Validate
    if ! cmd_validate; then
        return 1
    fi

    # Create .env if missing
    if [[ ! -f "$ENV_FILE" ]]; then
        print_info "Creating .env file..."
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        print_warning "Please configure .env before starting services"
        return 1
    fi

    print_success "Setup completed!"
    echo ""
    print_info "Next steps:"
    echo "1. Review and edit .env file with your configuration"
    echo "2. Run: $0 start"
    echo "3. Access frontend at: http://localhost:5173"
}

cmd_start() {
    print_header "Starting Game-Plug Services"

    if ! cmd_validate; then
        return 1
    fi

    print_info "Starting services..."
    cd "$PROJECT_DIR"
    docker compose up -d

    print_success "Services started!"
    print_info "Waiting for health checks..."
    sleep 5

    cmd_status
}

cmd_stop() {
    print_header "Stopping Game-Plug Services"

    print_info "Stopping services..."
    cd "$PROJECT_DIR"
    docker compose stop

    print_success "Services stopped"
}

cmd_restart() {
    print_header "Restarting Game-Plug Services"

    cmd_stop
    sleep 2
    cmd_start
}

cmd_status() {
    print_header "Service Status"

    cd "$PROJECT_DIR"
    docker compose ps

    echo ""
    print_info "Access points:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:5002"
    echo "  API Docs: http://localhost:5002/api"
    echo "  Database: localhost:5432"
    echo "  Redis:    localhost:6379"
}

cmd_logs() {
    print_header "Viewing Logs"

    local service="${1:-}"

    cd "$PROJECT_DIR"
    if [[ -n "$service" ]]; then
        docker compose logs -f --tail 100 "$service"
    else
        docker compose logs -f --tail 50
    fi
}

cmd_rebuild() {
    print_header "Rebuilding Images"

    local service="${1:-}"

    cd "$PROJECT_DIR"
    if [[ -n "$service" ]]; then
        print_info "Rebuilding $service..."
        docker compose build "$service"
    else
        print_info "Rebuilding all services..."
        docker compose build
    fi

    print_success "Build completed!"
}

cmd_clean() {
    print_header "Cleaning Up"

    read -p "Remove Docker volumes (this will delete database data)? (y/N): " -n 1 -r
    echo

    cd "$PROJECT_DIR"

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Removing containers and volumes..."
        docker compose down -v
        print_success "Cleanup completed"
    else
        print_info "Stopping containers..."
        docker compose down
        print_success "Containers stopped (volumes preserved)"
    fi
}

cmd_shell() {
    print_header "Opening Shell"

    local service="${1:-backend}"

    print_info "Opening shell in $service container..."
    cd "$PROJECT_DIR"
    docker compose exec "$service" sh
}

cmd_db_shell() {
    print_header "PostgreSQL Shell"

    print_info "Opening psql in postgres container..."
    cd "$PROJECT_DIR"
    docker compose exec postgres psql -U game_plug -d game_plug
}

cmd_redis_shell() {
    print_header "Redis CLI"

    print_info "Opening redis-cli..."
    cd "$PROJECT_DIR"
    docker compose exec redis redis-cli
}

cmd_migrate() {
    print_header "Running Database Migrations"

    print_info "Running migrations in backend container..."
    cd "$PROJECT_DIR"
    docker compose exec backend bun run migrate

    print_success "Migrations completed!"
}

cmd_health() {
    print_header "Health Check"

    local errors=0

    echo ""
    print_info "Backend API:"
    if curl -s http://localhost:5002/api/health > /dev/null 2>&1; then
        print_success "http://localhost:5002/api/health"
    else
        print_error "Backend API not responding"
        ((errors++))
    fi

    echo ""
    print_info "Frontend:"
    if curl -s http://localhost:5173 > /dev/null 2>&1; then
        print_success "http://localhost:5173"
    else
        print_error "Frontend not responding"
        ((errors++))
    fi

    echo ""
    print_info "Database:"
    if docker compose exec -T postgres pg_isready -U game_plug > /dev/null 2>&1; then
        print_success "PostgreSQL (localhost:5432)"
    else
        print_error "PostgreSQL not responding"
        ((errors++))
    fi

    echo ""
    print_info "Redis:"
    if docker compose exec -T redis redis-cli PING > /dev/null 2>&1; then
        print_success "Redis (localhost:6379)"
    else
        print_error "Redis not responding"
        ((errors++))
    fi

    echo ""
    if [[ $errors -eq 0 ]]; then
        print_success "All services are healthy!"
        return 0
    else
        print_error "$errors service(s) are not healthy"
        return 1
    fi
}

# =============================================================================
# Help
# =============================================================================

print_help() {
    cat << EOF
${BLUE}Game-Plug Docker Management${NC}

Usage: $(basename "$0") [command] [options]

${BLUE}Commands:${NC}
  setup          Setup Game-Plug and create .env file
  start          Start all services
  stop           Stop all services
  restart        Restart all services
  status         Show service status
  logs [service] View service logs (backend, frontend, postgres, redis)
  rebuild        Rebuild Docker images
  shell [svc]    Open shell in container (default: backend)
  dbshell        Open PostgreSQL psql shell
  redis          Open Redis CLI
  migrate        Run database migrations
  health         Check health of all services
  clean          Stop and remove containers (optionally remove volumes)
  validate       Validate Docker and configuration
  help           Show this help message

${BLUE}Examples:${NC}
  # Initial setup
  $(basename "$0") setup
  $(basename "$0") start

  # View logs
  $(basename "$0") logs backend
  $(basename "$0") logs frontend

  # Database management
  $(basename "$0") dbshell
  $(basename "$0") migrate

  # Troubleshooting
  $(basename "$0") health
  $(basename "$0") logs

EOF
}

# =============================================================================
# Main
# =============================================================================

main() {
    local command="${1:-help}"

    case "$command" in
        setup)
            cmd_setup
            ;;
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        status)
            cmd_status
            ;;
        logs)
            cmd_logs "$2"
            ;;
        rebuild)
            cmd_rebuild "$2"
            ;;
        shell)
            cmd_shell "$2"
            ;;
        dbshell|db)
            cmd_db_shell
            ;;
        redis)
            cmd_redis_shell
            ;;
        migrate)
            cmd_migrate
            ;;
        health)
            cmd_health
            ;;
        clean)
            cmd_clean
            ;;
        validate)
            cmd_validate
            ;;
        help|--help|-h)
            print_help
            ;;
        *)
            print_error "Unknown command: $command"
            echo ""
            print_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
