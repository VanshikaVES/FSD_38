# Hospital Appointment App - CI/CD Deployment Guide

This guide covers the complete CI/CD setup for deploying the Hospital Appointment application using GitHub Actions, Vercel (frontend), and Render (backend).

## 🚀 Deployment Architecture

- **Frontend**: React + Vite → Vercel
- **Backend**: Node.js + Express → Render
- **Database**: MongoDB Atlas (via Render)
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

1. GitHub repository
2. Vercel account
3. Render account
4. MongoDB Atlas account (optional, can use Render's managed MongoDB)

## 🔧 Setup Instructions

### 1. GitHub Repository Setup

1. Push your code to GitHub
2. Go to repository Settings → Secrets and variables → Actions
3. Add the following secrets:

#### Required Secrets:
```
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_STAGING_PROJECT_ID=your_vercel_staging_project_id

# Render Configuration
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_render_production_service_id
RENDER_STAGING_SERVICE_ID=your_render_staging_service_id
RENDER_PRODUCTION_URL=https://hospital-appointment.onrender.com
RENDER_STAGING_URL=https://hospital-appointment-staging.onrender.com

# Environment URLs
VERCEL_PRODUCTION_URL=https://hospital-appointment.vercel.app
VERCEL_STAGING_URL=https://hospital-appointment-staging.vercel.app

# Database Configuration
MONGODB_URI=your_production_mongodb_uri
MONGODB_STAGING_URI=your_staging_mongodb_uri
MONGODB_TEST_URI=your_test_mongodb_uri

# Optional Monitoring (for enhanced features)
SNYK_TOKEN=your_snyk_token
LHCI_GITHUB_APP_TOKEN=your_lighthouse_ci_token
LHCI_SERVER_BASE_URL=your_lighthouse_ci_server_url
LHCI_TOKEN=your_lighthouse_ci_token
```

### 2. Vercel Setup (Frontend)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```

4. **Get Vercel credentials**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → General
   - Copy Project ID and Team ID

5. **Set environment variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`

### 3. Render Setup (Backend)

1. **Connect GitHub repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure service**:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
   - **Plan**: Free

3. **Set environment variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or let Render assign)
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = A strong secret key
   - `CORS_ORIGIN` = Your Vercel frontend URL

4. **Create MongoDB database** (if using Render's managed MongoDB):
   - Go to Render Dashboard
   - Click "New" → "PostgreSQL" (or MongoDB if available)
   - Copy the connection string

### 4. MongoDB Atlas Setup (Alternative)

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string

## 🔄 Enhanced CI/CD Pipeline

The enhanced GitHub Actions workflows include:

### Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`):
**Frontend Pipeline:**
1. **Checkout code**
2. **Setup Node.js** (v18)
3. **Install dependencies**
4. **Run linter** (with error tolerance)
5. **Run type checking**
6. **Build application**
7. **Upload build artifacts**
8. **Deploy to Vercel** (production on main branch)

**Backend Pipeline:**
1. **Checkout code**
2. **Setup Node.js** (v18)
3. **Install dependencies**
4. **Run linting**
5. **Run tests with coverage**
6. **Upload test results**
7. **Deploy to Render** (production on main branch)
8. **Health check verification**

### Staging Deployment (`.github/workflows/deploy-staging.yml`):
- **Trigger**: Push to `develop` branch
- **Environment**: Staging
- **Features**: Integration tests, health checks

### Performance Testing (`.github/workflows/performance-test.yml`):
- **Schedule**: Weekly (Sundays at 3 AM)
- **Features**: Lighthouse CI, Artillery load tests, bundle analysis
- **Thresholds**: Performance budgets, bundle size limits

### Security Scanning (`.github/workflows/security-scan.yml`):
- **Schedule**: Weekly (Mondays at 2 AM)
- **Features**: npm audit, Snyk security scan
- **Integration**: GitHub Code Scanning

### Monitoring (`.github/workflows/monitoring.yml`):
- **Schedule**: Every 5 minutes
- **Features**: Health checks, metrics collection, alerting
- **Environments**: Staging and production monitoring

## 🛠️ Local Development

### Frontend:
```bash
npm install
npm run dev
```

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Environment Variables:
Copy `env.example` to `.env` and update values:
```bash
cp env.example .env
cp backend/env.example backend/.env
```

## 📝 Environment Variables

### Frontend (.env):
```env
VITE_API_URL=http://localhost:5000
```

### Backend (backend/.env):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-appointment
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Deployment Commands

### Manual Deployment:

#### Frontend (Vercel):
```bash
npm run deploy          # Production
npm run deploy:preview  # Preview
```

#### Backend (Render):
```bash
cd backend
npm run deploy
```

## 🆕 New Features

### Environment Management:
- **Staging Environment**: Automatic deployment on `develop` branch
- **Production Environment**: Automatic deployment on `main` branch
- **Environment Protection**: Required reviewers and wait timers
- **Manual Deployments**: Workflow dispatch with environment selection

### Enhanced Testing:
- **Test Coverage**: Jest coverage reports with thresholds
- **Integration Tests**: Staging environment integration testing
- **Performance Testing**: Lighthouse CI and Artillery load testing
- **Security Scanning**: Automated vulnerability scanning with Snyk

### Monitoring & Health Checks:
- **Health Endpoints**: `/health`, `/health/detailed`, `/metrics`
- **Automated Monitoring**: Every 5 minutes health checks
- **Alerting**: Automatic issue creation for failures
- **Performance Monitoring**: Weekly performance audits

### Rollback Capabilities:
- **Automatic Rollback**: Failed health checks trigger rollback
- **Manual Rollback**: One-click rollback via GitHub Actions
- **Deployment History**: Track deployment status and history

### Artifact Management:
- **Build Artifacts**: 7-day retention for builds and test results
- **Performance Reports**: Lighthouse and load test results
- **Coverage Reports**: Test coverage with detailed metrics

## 🔍 Monitoring & Debugging

### Vercel:
- Check deployment logs in Vercel dashboard
- Monitor function logs
- Check build logs
- **New**: Performance monitoring with Lighthouse CI

### Render:
- Check service logs in Render dashboard
- Monitor resource usage
- Check database connections
- **New**: Health check endpoints and metrics

### GitHub Actions:
- Go to Actions tab in GitHub repository
- Check workflow runs
- View detailed logs for each step
- **New**: Artifact downloads for test results and performance reports

### Health Monitoring:
- **Backend Health**: `GET /health` - Basic health status
- **Detailed Health**: `GET /health/detailed` - Database, memory, and system info
- **Metrics**: `GET /metrics` - Performance and resource metrics
- **Automated Alerts**: Issues created automatically for failures

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript/ESLint errors

2. **Deployment Failures**:
   - Verify environment variables are set
   - Check API endpoints are accessible
   - Verify CORS settings

3. **Database Connection Issues**:
   - Check MongoDB connection string
   - Verify network access
   - Check database credentials

## 📊 Performance Optimization

### Frontend:
- Code splitting (configured in vite.config.js)
- Image optimization
- Bundle analysis

### Backend:
- Database indexing
- Caching strategies
- API response optimization

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secrets**: Use strong, unique secrets
3. **CORS**: Configure properly for production
4. **HTTPS**: Both Vercel and Render provide HTTPS by default
5. **Database**: Use connection strings with authentication

## 📈 Scaling

### Vercel:
- Automatic scaling
- Edge functions
- CDN distribution

### Render:
- Upgrade to paid plans for better performance
- Database scaling options
- Load balancing

## 🔄 Updates & Maintenance

1. **Code Updates**: Push to main branch triggers automatic deployment
2. **Environment Changes**: Update in respective dashboards
3. **Database Migrations**: Run through Render console or CLI
4. **Monitoring**: Set up alerts for critical issues

## 🚀 Quick Setup

### Automated Setup Scripts:
- **Linux/Mac**: `./scripts/setup-ci-cd.sh`
- **Windows**: `scripts\setup-ci-cd.bat`

### Manual Setup:
1. Install dependencies: `npm install && cd backend && npm install`
2. Copy environment files: `cp env.example .env && cp backend/env.example backend/.env`
3. Configure GitHub secrets (see env-config.md)
4. Set up Vercel and Render services
5. Push to GitHub to trigger workflows

## 📞 Support

- **Vercel**: [Vercel Support](https://vercel.com/support)
- **Render**: [Render Support](https://render.com/support)
- **GitHub Actions**: [GitHub Docs](https://docs.github.com/en/actions)
- **Project Documentation**: See `env-config.md` for detailed configuration
