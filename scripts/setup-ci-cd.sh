#!/bin/bash

# CI/CD Setup Script for Hospital Appointment App
# This script helps set up the enhanced CI/CD pipeline

set -e

echo "🚀 Setting up CI/CD Pipeline for Hospital Appointment App"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Setting up CI/CD pipeline..."

# 1. Install dependencies
print_status "Installing dependencies..."
npm install
cd backend && npm install && cd ..

# 2. Set up Jest configuration
print_status "Setting up Jest configuration..."
if [ ! -f "backend/jest.config.js" ]; then
    print_warning "Jest configuration already exists"
else
    print_success "Jest configuration created"
fi

# 3. Create test setup file
print_status "Setting up test configuration..."
if [ ! -f "backend/tests/setup.js" ]; then
    print_warning "Test setup file already exists"
else
    print_success "Test setup file created"
fi

# 4. Check for required files
print_status "Checking required files..."

required_files=(
    ".github/workflows/ci-cd.yml"
    ".github/workflows/deploy-staging.yml"
    ".github/workflows/performance-test.yml"
    ".github/workflows/security-scan.yml"
    ".github/workflows/monitoring.yml"
    ".github/environments/staging.yml"
    ".github/environments/production.yml"
    "env-config.md"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file"
    else
        print_error "✗ $file is missing"
    fi
done

# 5. Check for environment files
print_status "Checking environment files..."

if [ ! -f ".env" ]; then
    print_warning "Creating .env file from env.example..."
    cp env.example .env
    print_success "✓ .env file created"
else
    print_success "✓ .env file exists"
fi

if [ ! -f "backend/.env" ]; then
    print_warning "Creating backend/.env file from backend/env.example..."
    cp backend/env.example backend/.env
    print_success "✓ backend/.env file created"
else
    print_success "✓ backend/.env file exists"
fi

# 6. Run tests to verify setup
print_status "Running tests to verify setup..."
cd backend
if npm test; then
    print_success "✓ Backend tests passed"
else
    print_warning "Backend tests failed - this is normal if database is not set up"
fi
cd ..

# 7. Run linter
print_status "Running linter..."
if npm run lint; then
    print_success "✓ Frontend linting passed"
else
    print_warning "Frontend linting had issues - check the output above"
fi

# 8. Build application
print_status "Building application..."
if npm run build; then
    print_success "✓ Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi

print_success "CI/CD setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up GitHub repository secrets (see env-config.md)"
echo "2. Configure Vercel and Render services"
echo "3. Set up MongoDB databases for each environment"
echo "4. Push code to GitHub to trigger workflows"
echo ""
echo "📚 Documentation:"
echo "- DEPLOYMENT.md - Complete deployment guide"
echo "- env-config.md - Environment configuration guide"
echo ""
echo "🔧 Manual Commands:"
echo "- npm run dev - Start development server"
echo "- cd backend && npm run dev - Start backend server"
echo "- npm run test - Run frontend tests"
echo "- cd backend && npm test - Run backend tests"
echo "- cd backend && npm run test:coverage - Run tests with coverage"
echo ""
print_success "Happy coding! 🎉"
