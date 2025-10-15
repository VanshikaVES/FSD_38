# Environment Configuration Guide

This document outlines the environment-specific configurations for the Hospital Appointment application.

## Environment Overview

### Development
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5000`
- **Database**: Local MongoDB or MongoDB Atlas

### Staging
- **Frontend**: `https://hospital-appointment-staging.vercel.app`
- **Backend**: `https://hospital-appointment-staging.onrender.com`
- **Database**: MongoDB Atlas (staging cluster)

### Production
- **Frontend**: `https://hospital-appointment.vercel.app`
- **Backend**: `https://hospital-appointment.onrender.com`
- **Database**: MongoDB Atlas (production cluster)

## Required GitHub Secrets

### Vercel Secrets
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_STAGING_PROJECT_ID=your_vercel_staging_project_id
```

### Render Secrets
```
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_render_production_service_id
RENDER_STAGING_SERVICE_ID=your_render_staging_service_id
RENDER_PRODUCTION_URL=https://hospital-appointment.onrender.com
RENDER_STAGING_URL=https://hospital-appointment-staging.onrender.com
```

### Vercel URLs
```
VERCEL_PRODUCTION_URL=https://hospital-appointment.vercel.app
VERCEL_STAGING_URL=https://hospital-appointment-staging.vercel.app
```

### Database Secrets
```
MONGODB_URI=your_production_mongodb_uri
MONGODB_STAGING_URI=your_staging_mongodb_uri
MONGODB_TEST_URI=your_test_mongodb_uri
```

### Optional Monitoring Secrets
```
SNYK_TOKEN=your_snyk_token
LHCI_GITHUB_APP_TOKEN=your_lighthouse_ci_token
LHCI_SERVER_BASE_URL=your_lighthouse_ci_server_url
LHCI_TOKEN=your_lighthouse_ci_token
```

## Environment Variables by Environment

### Frontend Environment Variables

#### Development (.env.local)
```env
VITE_API_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

#### Staging (Vercel Environment Variables)
```env
VITE_API_URL=https://hospital-appointment-staging.onrender.com
VITE_ENVIRONMENT=staging
```

#### Production (Vercel Environment Variables)
```env
VITE_API_URL=https://hospital-appointment.onrender.com
VITE_ENVIRONMENT=production
```

### Backend Environment Variables

#### Development (backend/.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital-appointment
JWT_SECRET=your-development-jwt-secret
CORS_ORIGIN=http://localhost:5173
```

#### Staging (Render Environment Variables)
```env
NODE_ENV=staging
PORT=10000
MONGODB_URI=your_staging_mongodb_uri
JWT_SECRET=your_staging_jwt_secret
CORS_ORIGIN=https://hospital-appointment-staging.vercel.app
```

#### Production (Render Environment Variables)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=https://hospital-appointment.vercel.app
```

## Deployment Workflows

### Automatic Deployments
- **Push to `main`**: Deploys to production
- **Push to `develop`**: Deploys to staging
- **Pull Request**: Runs tests and creates preview deployments

### Manual Deployments
- **Staging**: Manual trigger available in GitHub Actions
- **Production**: Manual trigger with environment selection
- **Rollback**: Manual rollback trigger available

## Health Check Endpoints

### Backend Health Checks
- **Basic**: `GET /health`
- **Detailed**: `GET /health/detailed`
- **Metrics**: `GET /metrics`

### Frontend Health Checks
- **Basic**: Root URL accessibility check
- **Performance**: Lighthouse CI integration

## Monitoring and Alerts

### Automated Monitoring
- Health checks every 5 minutes
- Performance monitoring weekly
- Security scanning on every push
- Database monitoring (if configured)

### Alert Conditions
- Backend health check fails
- Frontend becomes inaccessible
- Performance scores below threshold
- Security vulnerabilities detected

## Rollback Procedures

### Automatic Rollback
- Failed health checks after deployment
- Critical errors detected

### Manual Rollback
1. Go to GitHub Actions
2. Select "CI/CD Pipeline" workflow
3. Click "Run workflow"
4. Select "rollback" environment
5. Click "Run workflow"

## Best Practices

### Environment Management
1. Never use production secrets in development
2. Use different databases for each environment
3. Implement proper CORS settings per environment
4. Use environment-specific JWT secrets

### Deployment Safety
1. Always test in staging first
2. Use feature flags for gradual rollouts
3. Monitor deployments closely
4. Have rollback procedures ready

### Security
1. Rotate secrets regularly
2. Use least privilege access
3. Monitor for security vulnerabilities
4. Keep dependencies updated
