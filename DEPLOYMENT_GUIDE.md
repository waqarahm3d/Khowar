# Pakistani Music App - Deployment Guide

## 🇵🇰 Overview

This guide will help you deploy the Pakistani Music App (Qoqnuz Portal) with all its cultural features, multi-cloud storage support, and admin capabilities.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Linux (Ubuntu 20.04+ recommended), macOS, or Windows with WSL2
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 20GB free space
- **Network**: Stable internet connection for downloading dependencies

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Docker**: Version 20.10.0 or higher
- **Docker Compose**: Version 2.0.0 or higher
- **Git**: Latest version

### Optional but Recommended
- **PostgreSQL**: Version 15+ (if not using Docker)
- **Redis**: Version 7+ (if not using Docker)
- **Nginx**: For production deployment

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/qoqnuz/pakistani-music-app.git
cd pakistani-music-app
```

### 2. Run the Setup Script

```bash
# Make the setup script executable
chmod +x setup.sh

# Run the complete setup
./setup.sh
```

The setup script will:
- ✅ Check system requirements
- ✅ Install all dependencies
- ✅ Set up environment variables
- ✅ Configure database and Redis
- ✅ Set up cloud storage (MinIO for development)
- ✅ Initialize Pakistani cultural data
- ✅ Start all services
- ✅ Set up monitoring and analytics

### 3. Access the Application

After setup completes, you can access:

- **🎵 Admin Backend API**: http://localhost:3000
- **🎛️ Web Admin Dashboard**: http://localhost:3001
- **📊 Monitoring (Grafana)**: http://localhost:3002
- **🔍 Elasticsearch**: http://localhost:9200
- **📦 MinIO Console**: http://localhost:9001
- **📧 MailHog**: http://localhost:8025

## 🔧 Manual Setup

If you prefer to set up manually or need to customize the installation:

### 1. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd admin-backend && npm install && cd ..

# Install web admin dependencies
cd web-admin && npm install && cd ..

# Install mobile app dependencies
cd mobile-app && npm install && cd ..
```

### 3. Database Setup

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Run migrations
cd admin-backend
npm run db:generate
npm run db:push
cd ..
```

### 4. Start Services

```bash
# Start all services
docker-compose up -d

# Or start individual services
docker-compose up -d redis
docker-compose up -d admin-backend
docker-compose up -d web-admin
```

## 🌐 Production Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Production Environment

```bash
# Create production environment file
cp .env.example .env.production

# Edit production variables
nano .env.production
```

Key production variables to configure:
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:password@your-db-host:5432/pakistani_music_app
REDIS_HOST=your-redis-host
JWT_SECRET=your-very-secure-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

### 3. SSL/HTTPS Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 4. Deploy with Docker

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Cloud Storage Configuration

### AWS S3 Setup

```bash
# Configure AWS credentials
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=us-east-1
export AWS_S3_BUCKET=pakistani-music-app
```

### Wasabi Setup

```bash
# Configure Wasabi (S3-compatible)
export WASABI_ACCESS_KEY_ID=your-wasabi-key
export WASABI_SECRET_ACCESS_KEY=your-wasabi-secret
export WASABI_ENDPOINT=https://s3.wasabisys.com
export WASABI_BUCKET=pakistani-music-app
```

### Google Cloud Storage

```bash
# Set up Google Cloud credentials
export GOOGLE_CLOUD_PROJECT_ID=your-project-id
export GOOGLE_CLOUD_KEY_FILE=./path/to/service-account-key.json
export GOOGLE_CLOUD_BUCKET=pakistani-music-app
```

## 🎨 Cultural Configuration

### Language Setup

The app supports multiple languages with cultural considerations:

```bash
# Default language (Urdu)
DEFAULT_LANGUAGE=urdu

# Supported languages
SUPPORTED_LANGUAGES=urdu,english,punjabi,sindhi,pashto
```

### Theme Configuration

```bash
# Default theme (Pakistan Green)
DEFAULT_THEME=pakistan-green

# Available themes
# - pakistan-green: Traditional green and white
# - saffron-gold: Saffron and gold accents
# - cultural-blue: Deep blue with cultural elements
```

### Cultural Events

The system includes Pakistani cultural events and festivals:

- **Eid ul-Fitr** (عید الفطر)
- **Eid ul-Adha** (عید الاضحیٰ)
- **Basant** (بسنت)
- **Shandur Polo Festival** (شندور پولو فیسٹیول)

## 📱 Mobile App Deployment

### Android Build

```bash
cd mobile-app

# Install dependencies
npm install

# Build for Android
npm run build:android

# Generated APK will be in android/app/build/outputs/apk/release/
```

### iOS Build

```bash
cd mobile-app

# Install dependencies
npm install

# Install iOS dependencies
cd ios && pod install && cd ..

# Build for iOS
npm run build:ios
```

## 🔍 Monitoring and Analytics

### Grafana Dashboard

1. Access Grafana at http://localhost:3002
2. Login with admin/admin123
3. Import Pakistani Music App dashboard
4. Configure data sources

### Prometheus Metrics

The application exposes metrics at:
- Backend: http://localhost:3000/metrics
- Custom metrics for Pakistani cultural events
- User engagement analytics

### Elasticsearch

Search functionality powered by Elasticsearch:
- Music search with Urdu support
- Cultural content indexing
- User behavior analytics

## 🛡️ Security Configuration

### JWT Security

```bash
# Generate secure JWT secret
openssl rand -base64 32

# Configure JWT expiration
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Database Security

```bash
# Use strong database passwords
POSTGRES_PASSWORD=your-very-secure-password

# Enable SSL for database connections
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
```

### File Upload Security

```bash
# Configure file size limits
MAX_FILE_SIZE=52428800  # 50MB

# Allowed file types
ALLOWED_MIME_TYPES=audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/aac,audio/ogg,audio/m4a,image/jpeg,image/png,image/webp
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check database status
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

#### 2. Redis Connection Issues

```bash
# Check Redis status
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

#### 3. File Upload Issues

```bash
# Check storage permissions
ls -la uploads/

# Check MinIO status
docker-compose ps minio

# Access MinIO console
open http://localhost:9001
```

#### 4. Cultural Data Loading Issues

```bash
# Reload cultural data
cd admin-backend
npm run seed:cultural-data

# Check cultural events
curl http://localhost:3000/api/cultural/events
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX idx_songs_language ON songs(language);
CREATE INDEX idx_songs_cultural_tags ON songs USING GIN(cultural_tags);
CREATE INDEX idx_songs_created_at ON songs(created_at);
```

#### 2. Redis Caching

```bash
# Configure Redis memory
REDIS_MAXMEMORY=256mb
REDIS_MAXMEMORY_POLICY=allkeys-lru
```

#### 3. File Compression

```bash
# Enable gzip compression
ENABLE_COMPRESSION=true

# Configure compression level
COMPRESSION_LEVEL=6
```

## 📊 Backup and Recovery

### Database Backup

```bash
# Create database backup
docker-compose exec postgres pg_dump -U postgres pakistani_music_app > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres pakistani_music_app < backup.sql
```

### File Storage Backup

```bash
# Backup uploads directory
tar -czf uploads-backup.tar.gz uploads/

# Backup MinIO data
docker-compose exec minio mc mirror /data /backup
```

## 🔄 Updates and Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm run install:all

# Run database migrations
cd admin-backend && npm run db:migrate && cd ..

# Restart services
docker-compose restart
```

### Regular Maintenance

```bash
# Clean up old logs
docker system prune -f

# Update Docker images
docker-compose pull

# Backup before updates
./backup.sh

# Apply updates
./setup.sh
```

## 📞 Support

For technical support and questions:

- **Email**: support@qoqnuz.com
- **Documentation**: https://docs.qoqnuz.com
- **Community**: https://community.qoqnuz.com
- **Issues**: https://github.com/qoqnuz/pakistani-music-app/issues

## 🎯 Next Steps

After successful deployment:

1. **Configure Cloud Storage**: Set up your preferred cloud storage provider
2. **Upload Content**: Add Pakistani music and cultural content
3. **Create Admin Users**: Set up administrative accounts
4. **Customize Themes**: Adjust cultural themes and colors
5. **Configure Analytics**: Set up monitoring and user analytics
6. **Mobile App**: Deploy the mobile application
7. **Marketing**: Launch your Pakistani music platform

---

**Made with ❤️ in Pakistan 🇵🇰**

*This deployment guide ensures your Pakistani Music App is set up with all cultural elements, security features, and scalability considerations for serving the Pakistani music community.*