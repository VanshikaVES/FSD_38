@echo off
REM Hospital Appointment App - Deployment Script (Windows)
REM This script helps with manual deployment and environment setup

setlocal enabledelayedexpansion

REM Colors for output (Windows doesn't support colors in batch, but we can use echo)
set "INFO=[INFO]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM Function to print status
:print_status
echo %INFO% %~1
goto :eof

:print_warning
echo %WARNING% %~1
goto :eof

:print_error
echo %ERROR% %~1
goto :eof

REM Check if required tools are installed
:check_dependencies
call :print_status "Checking dependencies..."

where node >nul 2>nul
if %errorlevel% neq 0 (
    call :print_error "Node.js is not installed. Please install Node.js 18+"
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    call :print_error "npm is not installed. Please install npm"
    exit /b 1
)

call :print_status "All dependencies are installed ✓"
goto :eof

REM Setup environment files
:setup_env
call :print_status "Setting up environment files..."

if not exist .env (
    copy env.example .env >nul
    call :print_warning "Created .env file from template. Please update with your values."
) else (
    call :print_status ".env file already exists"
)

if not exist backend\.env (
    copy backend\env.example backend\.env >nul
    call :print_warning "Created backend\.env file from template. Please update with your values."
) else (
    call :print_status "backend\.env file already exists"
)
goto :eof

REM Install dependencies
:install_deps
call :print_status "Installing frontend dependencies..."
npm install

call :print_status "Installing backend dependencies..."
cd backend
npm install
cd ..
goto :eof

REM Run tests
:run_tests
call :print_status "Running tests..."

REM Frontend tests (if any)
if exist package.json (
    findstr /C:"\"test\"" package.json >nul
    if !errorlevel! equ 0 (
        npm test
    )
)

REM Backend tests
cd backend
if exist package.json (
    findstr /C:"\"test\"" package.json >nul
    if !errorlevel! equ 0 (
        npm test
    )
)
cd ..
goto :eof

REM Build application
:build_app
call :print_status "Building frontend..."
npm run build

call :print_status "Building backend..."
cd backend
npm run build
cd ..
goto :eof

REM Deploy to Vercel
:deploy_frontend
call :print_status "Deploying frontend to Vercel..."

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    call :print_error "Vercel CLI is not installed. Please install it with: npm i -g vercel"
    exit /b 1
)

vercel --prod
goto :eof

REM Deploy to Render
:deploy_backend
call :print_status "Deploying backend to Render..."
call :print_warning "Please deploy manually through Render dashboard or use Render CLI"
goto :eof

REM Main deployment function
:deploy
call :print_status "Starting deployment process..."

call :check_dependencies
if %errorlevel% neq 0 exit /b 1

call :setup_env
call :install_deps
call :run_tests
call :build_app

if "%1"=="frontend" (
    call :deploy_frontend
) else if "%1"=="backend" (
    call :deploy_backend
) else if "%1"=="all" (
    call :deploy_frontend
    call :deploy_backend
) else (
    call :print_error "Usage: %0 [frontend|backend|all]"
    exit /b 1
)

call :print_status "Deployment completed! 🚀"
goto :eof

REM Development setup
:dev_setup
call :print_status "Setting up development environment..."

call :check_dependencies
if %errorlevel% neq 0 exit /b 1

call :setup_env
call :install_deps

call :print_status "Development setup completed!"
call :print_status "To start development:"
call :print_status "  Frontend: npm run dev"
call :print_status "  Backend: cd backend && npm run dev"
goto :eof

REM Show help
:show_help
echo Hospital Appointment App - Deployment Script
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   dev-setup    Set up development environment
echo   deploy       Deploy application (frontend^|backend^|all)
echo   test         Run tests
echo   build        Build application
echo   help         Show this help message
echo.
echo Examples:
echo   %0 dev-setup
echo   %0 deploy frontend
echo   %0 deploy backend
echo   %0 deploy all
echo   %0 test
echo   %0 build
goto :eof

REM Main script logic
if "%1"=="dev-setup" (
    call :dev_setup
) else if "%1"=="deploy" (
    call :deploy %2
) else if "%1"=="test" (
    call :check_dependencies
    if %errorlevel% neq 0 exit /b 1
    call :run_tests
) else if "%1"=="build" (
    call :check_dependencies
    if %errorlevel% neq 0 exit /b 1
    call :build_app
) else (
    call :show_help
)
