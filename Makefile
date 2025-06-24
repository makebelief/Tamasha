# Default shell
SHELL := /bin/bash

# Go settings
export GOPATH := $(HOME)/go
export PATH := $(GOPATH)/bin:$(PATH)

# Project directories
FRONTEND_DIR := .
BACKEND_DIR := backend

.PHONY: all install run clean frontend backend

# Default target
all: install run

# Install dependencies
install: install-frontend install-backend

install-frontend:
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install --legacy-peer-deps

install-backend:
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && GOPATH=$(GOPATH) go mod download

# Run the application
run: run-backend run-frontend
	@echo "🌟 Starting up your development environment! Please be patient..."
	@echo "🔄 The servers are warming up - this might take a minute..."
	@echo "🎯 Backend will be available at http://localhost:8080"
	@echo "🎨 Frontend will be available at http://localhost:3000"
	@echo "⏳ Waiting for servers to be ready..."
	@echo "💡 TIP: First startup takes longer due to dependency installation and compilation"
	@sleep 3
	@echo "🚀 Almost there! Your ports will be available shortly..."

run-frontend: install-frontend
	@echo "🛠️  Starting frontend server..."
	cd $(FRONTEND_DIR) && npm run dev &

run-backend:
	@echo "⚙️  Starting backend server..."
	cd $(BACKEND_DIR) && GOPATH=$(GOPATH) go run -mod=mod cmd/api/main.go &

# Clean up
clean:
	@echo "Cleaning up..."
	cd $(FRONTEND_DIR) && rm -rf node_modules .next
	cd $(BACKEND_DIR) && go clean
	@echo "Cleanup complete"

# Stop all running services
stop:
	@echo "Stopping all services..."
	@-pkill -f "npm run dev" 2>/dev/null || true
	@-pkill -f "go run -mod=mod cmd/api/main.go" 2>/dev/null || true
	@echo "All services stopped"

# Development mode - runs with file watching
dev: install
	@echo "Starting development servers..."
	@make run
	@echo "Development servers started. Press Ctrl+C to stop."
	@# Wait for Ctrl+C and then stop all services
	@trap 'make stop' INT; while true; do sleep 1; done

# Show help
help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make run       - Run both frontend and backend servers"
	@echo "  make dev       - Run in development mode with file watching"
	@echo "  make stop      - Stop all running services"
	@echo "  make clean     - Clean up build artifacts"
	@echo "  make help      - Show this help message" 