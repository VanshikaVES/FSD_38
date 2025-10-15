#!/bin/bash

# Hospital Appointment App - Deployment Script
# This script helps with manual deployment and environment setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    print_status "All dependencies are installed ✓"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        print_warning "Created .env file from template. Please update with your values."
    else
        print_status ".env file already exists"
    fi
    
    if [ ! -f backend/.env ]; then
        cp backend/env.example backend/.env
        print_warning "Created backend/.env file from template. Please update with your values."
    else
        print_status "backend/.env file already exists"
    fi
}

# Install dependencies
install_deps() {
    print_status "Installing frontend dependencies..."
    npm install
    
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests (if any)
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test
    fi
    
    # Backend tests
    cd backend
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test
    fi
    cd ..
}

# Build application
build_app() {
    print_status "Building frontend..."
    npm run build
    
    print_status "Building backend..."
    cd backend
    npm run build
    cd ..
}

# Deploy to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
        exit 1
    fi
    
    vercel --prod
}

# Deploy to Render
deploy_backend() {
    print_status "Deploying backend to Render..."
    print_warning "Please deploy manually through Render dashboard or use Render CLI"
}

# Main deployment function
deploy() {
    print_status "Starting deployment process..."
    
    check_dependencies
    setup_env
    install_deps
    run_tests
    build_app
    
    if [ "$1" = "frontend" ]; then
        deploy_frontend
    elif [ "$1" = "backend" ]; then
        deploy_backend
    elif [ "$1" = "all" ]; then
        deploy_frontend
        deploy_backend
    else
        print_error "Usage: $0 [frontend|backend|all]"
        exit 1
    fi
    
    print_status "Deployment completed! 🚀"
}

# Development setup
dev_setup() {
    print_status "Setting up development environment..."
    
    check_dependencies
    setup_env
    install_deps
    
    print_status "Development setup completed!"
    print_status "To start development:"
    print_status "  Frontend: npm run dev"
    print_status "  Backend: cd backend && npm run dev"
}

# Show help
show_help() {
    echo "Hospital Appointment App - Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev-setup    Set up development environment"
    echo "  deploy       Deploy application (frontend|backend|all)"
    echo "  test         Run tests"
    echo "  build        Build application"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev-setup"
    echo "  $0 deploy frontend"
    echo "  $0 deploy backend"
    echo "  $0 deploy all"
    echo "  $0 test"
    echo "  $0 build"
}

# Main script logic
case "${1:-help}" in
    "dev-setup")
        dev_setup
        ;;
    "deploy")
        deploy "$2"
        ;;
    "test")
        check_dependencies
        run_tests
        ;;
    "build")
        check_dependencies
        build_app
        ;;
    "help"|*)
        show_help
        ;;
esac
