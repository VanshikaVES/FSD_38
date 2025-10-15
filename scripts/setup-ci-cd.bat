@echo off
REM CI/CD Setup Script for Hospital Appointment App
REM This script helps set up the enhanced CI/CD pipeline

echo 🚀 Setting up CI/CD Pipeline for Hospital Appointment App
echo ==================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the project root directory
    exit /b 1
)

if not exist "backend" (
    echo [ERROR] Backend directory not found
    exit /b 1
)

echo [INFO] Setting up CI/CD pipeline...

REM 1. Install dependencies
echo [INFO] Installing dependencies...
call npm install
cd backend
call npm install
cd ..

REM 2. Check for required files
echo [INFO] Checking required files...

if exist ".github\workflows\ci-cd.yml" (
    echo [SUCCESS] ✓ .github\workflows\ci-cd.yml
) else (
    echo [ERROR] ✗ .github\workflows\ci-cd.yml is missing
)

if exist ".github\workflows\deploy-staging.yml" (
    echo [SUCCESS] ✓ .github\workflows\deploy-staging.yml
) else (
    echo [ERROR] ✗ .github\workflows\deploy-staging.yml is missing
)

if exist ".github\workflows\performance-test.yml" (
    echo [SUCCESS] ✓ .github\workflows\performance-test.yml
) else (
    echo [ERROR] ✗ .github\workflows\performance-test.yml is missing
)

if exist ".github\workflows\security-scan.yml" (
    echo [SUCCESS] ✓ .github\workflows\security-scan.yml
) else (
    echo [ERROR] ✗ .github\workflows\security-scan.yml is missing
)

if exist ".github\workflows\monitoring.yml" (
    echo [SUCCESS] ✓ .github\workflows\monitoring.yml
) else (
    echo [ERROR] ✗ .github\workflows\monitoring.yml is missing
)

REM 3. Check for environment files
echo [INFO] Checking environment files...

if not exist ".env" (
    echo [WARNING] Creating .env file from env.example...
    copy env.example .env
    echo [SUCCESS] ✓ .env file created
) else (
    echo [SUCCESS] ✓ .env file exists
)

if not exist "backend\.env" (
    echo [WARNING] Creating backend\.env file from backend\env.example...
    copy backend\env.example backend\.env
    echo [SUCCESS] ✓ backend\.env file created
) else (
    echo [SUCCESS] ✓ backend\.env file exists
)

REM 4. Run linter
echo [INFO] Running linter...
call npm run lint
if %errorlevel% equ 0 (
    echo [SUCCESS] ✓ Frontend linting passed
) else (
    echo [WARNING] Frontend linting had issues - check the output above
)

REM 5. Build application
echo [INFO] Building application...
call npm run build
if %errorlevel% equ 0 (
    echo [SUCCESS] ✓ Frontend build successful
) else (
    echo [ERROR] Frontend build failed
    exit /b 1
)

echo [SUCCESS] CI/CD setup completed successfully!
echo.
echo 📋 Next Steps:
echo 1. Set up GitHub repository secrets (see env-config.md)
echo 2. Configure Vercel and Render services
echo 3. Set up MongoDB databases for each environment
echo 4. Push code to GitHub to trigger workflows
echo.
echo 📚 Documentation:
echo - DEPLOYMENT.md - Complete deployment guide
echo - env-config.md - Environment configuration guide
echo.
echo 🔧 Manual Commands:
echo - npm run dev - Start development server
echo - cd backend ^&^& npm run dev - Start backend server
echo - npm run test - Run frontend tests
echo - cd backend ^&^& npm test - Run backend tests
echo - cd backend ^&^& npm run test:coverage - Run tests with coverage
echo.
echo [SUCCESS] Happy coding! 🎉
pause
