# Voice of Chitral - System Architecture
**Version:** 2.0
**Date:** 2025-01-09

---

## 1. Architecture Overview

Voice of Chitral is a **monolithic web application** deployed on a single VPS, optimized for simplicity and low operational overhead. The system uses a 3-tier architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET (HTTPS)                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Cloudflare (CDN)  │  (Optional)
                    │  - DNS Management   │
                    │  - DDoS Protection  │
                    │  - Static Caching   │
                    └──────────┬──────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                         VPS (Ubuntu 22.04)                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Nginx Reverse Proxy (Port 80/443)             │ │
│  │  - SSL Termination (Let's Encrypt)                         │ │
│  │  - Gzip/Brotli Compression                                 │ │
│  │  - Static File Serving (/static, /media)                   │ │
│  │  - Rate Limiting (100 req/min per IP)                      │ │
│  │  - Caching Headers (immutable assets)                      │ │
│  └─────┬──────────────────────────────────────────┬────────────┘ │
│        │                                          │               │
│  ┌─────▼──────────────┐                 ┌────────▼────────────┐ │
│  │  Frontend (PWA)    │                 │  Backend API        │ │
│  │  Port 3000         │                 │  Port 8000          │ │
│  │  ┌──────────────┐  │                 │  ┌──────────────┐   │ │
│  │  │ Flutter Web  │  │                 │  │  FastAPI     │   │ │
│  │  │ - React      │  │◄────REST API────┤  │  (Python)    │   │ │
│  │  │ - TailwindCSS│  │                 │  │              │   │ │
│  │  │ - PWA Manifest│ │                 │  │  - Auth      │   │ │
│  │  │ - Service    │  │                 │  │  - Catalog   │   │ │
│  │  │   Worker     │  │                 │  │  - Playback  │   │ │
│  │  │ - IndexedDB  │  │                 │  │  - Admin     │   │ │
│  │  └──────────────┘  │                 │  └──────┬───────┘   │ │
│  └────────────────────┘                 │         │           │ │
│                                         │         │           │ │
│                                         │  ┌──────▼────────┐  │ │
│                                         │  │  PostgreSQL   │  │ │
│                                         │  │  Port 5432    │  │ │
│                                         │  │  ┌─────────┐  │  │ │
│                                         │  │  │ users   │  │  │ │
│                                         │  │  │ tracks  │  │  │ │
│                                         │  │  │ artists │  │  │ │
│                                         │  │  │ albums  │  │  │ │
│                                         │  │  │ playlists│ │  │ │
│                                         │  │  └─────────┘  │  │ │
│                                         │  └───────────────┘  │ │
│                                         │                     │ │
│                                         │  ┌──────────────┐   │ │
│                                         │  │   Redis      │   │ │
│                                         │  │   Port 6379  │   │ │
│                                         │  │  ┌────────┐  │   │ │
│                                         │  │  │Sessions│  │   │ │
│                                         │  │  │Cache   │  │   │ │
│                                         │  │  │Queue   │  │   │ │
│                                         │  │  └────────┘  │   │ │
│                                         │  └──────────────┘   │ │
│                                         └─────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   File Storage                            │  │
│  │  /var/www/voice-of-chitral/                              │  │
│  │  ├── audio/          (MP3, FLAC)                          │  │
│  │  ├── artwork/        (JPG, PNG)                           │  │
│  │  └── waveforms/      (JSON/SVG)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               Docker Compose Services                     │  │
│  │  - nginx                                                  │  │
│  │  - frontend                                               │  │
│  │  - backend                                                │  │
│  │  - postgres                                               │  │
│  │  - redis                                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Monitoring & Logging                         │  │
│  │  - Prometheus (metrics)                                   │  │
│  │  - Grafana (dashboards)                                   │  │
│  │  - Loki (log aggregation)                                 │  │
│  │  - JSON logs → /var/log/voice-of-chitral/                │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Architecture

### 2.1 Frontend (Flutter Web / Next.js)

**Technology:**
- **Preferred:** Flutter Web (for future mobile app parity)
- **Alternative:** Next.js 14 + React 18 + TailwindCSS

**Key Features:**
```
Frontend/
├── Authentication
│   ├── Login/Register Forms
│   ├── OAuth Flow (Google)
│   └── JWT Token Management
│
├── Music Discovery
│   ├── Home Feed (Recommendations)
│   ├── Search (Debounced, Fuzzy)
│   └── Browse (Artists, Albums, Playlists)
│
├── Player
│   ├── Persistent Player Component
│   ├── Playback Controls
│   ├── Queue Management
│   └── Repeat/Shuffle Modes
│
├── Library
│   ├── Liked Songs
│   ├── Playlists (CRUD)
│   └── Followed Artists
│
├── Offline Mode
│   ├── IndexedDB Cache
│   ├── Service Worker
│   └── Encrypted Storage (AES-256)
│
└── Admin Portal
    ├── Song Upload
    ├── User Management
    └── Analytics Dashboard
```

**State Management:**
- **Flutter:** Provider or Riverpod
- **React:** Zustand or Redux Toolkit

**Offline Strategy:**
- Service Worker caches shell (HTML, CSS, JS)
- IndexedDB stores track metadata and encrypted audio
- Background sync for user actions (likes, playlist edits)

**PWA Manifest:**
```json
{
  "name": "Voice of Chitral",
  "short_name": "VoC",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#1DB954",
  "icons": [...]
}
```

---

### 2.2 Backend (FastAPI)

**Technology:**
- **Framework:** FastAPI (Python 3.11+)
- **ASGI Server:** Uvicorn
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic

**Modular Structure:**
```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry
│   ├── config.py               # Environment config
│   ├── dependencies.py         # DI (auth, db sessions)
│   │
│   ├── auth/
│   │   ├── router.py           # /auth/* routes
│   │   ├── service.py          # Business logic
│   │   ├── models.py           # User, Session
│   │   └── schemas.py          # Pydantic models
│   │
│   ├── catalog/
│   │   ├── tracks.py           # /tracks/* routes
│   │   ├── artists.py          # /artists/* routes
│   │   ├── albums.py           # /albums/* routes
│   │   ├── playlists.py        # /playlists/* routes
│   │   └── search.py           # /search route
│   │
│   ├── playback/
│   │   ├── stream.py           # Audio streaming
│   │   ├── queue.py            # Queue management
│   │   └── offline.py          # DRM license
│   │
│   ├── admin/
│   │   ├── upload.py           # Song upload
│   │   ├── users.py            # User management
│   │   └── analytics.py        # Metrics
│   │
│   ├── db/
│   │   ├── models.py           # SQLAlchemy models
│   │   ├── session.py          # DB session factory
│   │   └── migrations/         # Alembic versions
│   │
│   ├── core/
│   │   ├── security.py         # JWT, hashing
│   │   ├── cache.py            # Redis wrapper
│   │   └── storage.py          # File storage abstraction
│   │
│   └── utils/
│       ├── audio.py            # Waveform generation
│       └── image.py            # Thumbnail generation
│
├── tests/
│   ├── test_auth.py
│   ├── test_catalog.py
│   └── test_playback.py
│
├── alembic.ini
├── pyproject.toml
└── Dockerfile
```

**Key Endpoints:**
```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/oauth/google
POST   /api/auth/refresh
GET    /api/auth/me

Catalog:
GET    /api/tracks              # List tracks
GET    /api/tracks/{id}         # Get track details
GET    /api/tracks/{id}/stream  # Stream audio
POST   /api/tracks/{id}/like    # Like track
GET    /api/search?q=query      # Search

Playlists:
GET    /api/playlists           # User's playlists
POST   /api/playlists           # Create playlist
PUT    /api/playlists/{id}      # Update playlist
DELETE /api/playlists/{id}      # Delete playlist
POST   /api/playlists/{id}/tracks  # Add track

Playback:
GET    /api/playback/queue      # Get user queue
POST   /api/playback/queue      # Update queue
POST   /api/playback/offline/license  # Get offline license

Admin:
POST   /api/admin/tracks        # Upload track
GET    /api/admin/users         # List users
GET    /api/admin/analytics     # Get metrics
```

---

### 2.3 Database (PostgreSQL)

**Version:** PostgreSQL 15

**Optimization:**
- Indexes on frequently queried columns (track title, artist name)
- Full-text search using `tsvector` for song search
- Partitioning for `playback_events` table (by month)
- Connection pooling (PgBouncer or SQLAlchemy pool)

**Backup Strategy:**
```bash
# Daily cron job
pg_dump -U voiceofchitral -d voiceofchitral | gzip > /backups/db_$(date +%Y%m%d).sql.gz

# Keep last 7 days
find /backups -name "db_*.sql.gz" -mtime +7 -delete
```

---

### 2.4 Cache (Redis)

**Version:** Redis 7

**Use Cases:**
```
Sessions:
- Key: session:{user_id}
- TTL: 1 hour (sliding expiration)
- Value: JWT payload

Recommendations:
- Key: recs:{user_id}
- TTL: 1 day
- Value: List of track IDs

Hot Content:
- Key: hot:tracks
- TTL: 1 hour
- Value: Sorted set (score = play count)

Search Cache:
- Key: search:{query_hash}
- TTL: 5 minutes
- Value: Search results JSON

Rate Limiting:
- Key: ratelimit:{ip}:{endpoint}
- TTL: 1 minute
- Value: Request count
```

---

### 2.5 File Storage

**Structure:**
```
/var/www/voice-of-chitral/
├── audio/
│   └── {track_id}.mp3          # Transcoded to 128/320 kbps
│
├── artwork/
│   ├── {track_id}_thumb.jpg    # 300x300
│   └── {track_id}_full.jpg     # 1000x1000
│
└── waveforms/
    └── {track_id}.json         # Peaks for visualization
```

**Alternative (Cloud Storage):**
- **S3-Compatible:** Wasabi, Backblaze B2, Cloudflare R2
- **CDN:** Serve via CloudFlare for lower latency

---

## 3. Data Flow Diagrams

### 3.1 User Login Flow

```
┌─────────┐                ┌─────────┐                ┌──────────┐
│ Browser │                │ Backend │                │   Redis  │
└────┬────┘                └────┬────┘                └────┬─────┘
     │                          │                          │
     │  POST /auth/login        │                          │
     ├─────────────────────────>│                          │
     │  {email, password}       │                          │
     │                          │                          │
     │                          │  Verify password         │
     │                          │  (Argon2 hash)           │
     │                          │                          │
     │                          │  Generate JWT (1h)       │
     │                          │                          │
     │                          │  Store session           │
     │                          ├─────────────────────────>│
     │                          │  SET session:{user_id}   │
     │                          │                          │
     │  200 OK                  │                          │
     │  {token, user}           │                          │
     │<─────────────────────────┤                          │
     │                          │                          │
     │  Store token in          │                          │
     │  localStorage            │                          │
     │                          │                          │
```

---

### 3.2 Track Playback Flow

```
┌─────────┐       ┌─────────┐       ┌──────────┐       ┌─────────┐
│ Browser │       │ Backend │       │   Redis  │       │  Files  │
└────┬────┘       └────┬────┘       └────┬─────┘       └────┬────┘
     │                 │                  │                  │
     │ GET /tracks/{id}│                  │                  │
     ├────────────────>│                  │                  │
     │                 │                  │                  │
     │                 │  Check cache     │                  │
     │                 ├─────────────────>│                  │
     │                 │  GET track:{id}  │                  │
     │                 │                  │                  │
     │                 │  Cache miss      │                  │
     │                 │<─────────────────┤                  │
     │                 │                  │                  │
     │                 │  Query DB (PostgreSQL)              │
     │                 │                  │                  │
     │                 │  Cache result    │                  │
     │                 ├─────────────────>│                  │
     │                 │  SETEX track:{id}│ 1h              │
     │                 │                  │                  │
     │ 200 OK          │                  │                  │
     │ {metadata}      │                  │                  │
     │<────────────────┤                  │                  │
     │                 │                  │                  │
     │ GET /tracks/{id}/stream            │                  │
     ├────────────────>│                  │                  │
     │                 │                  │                  │
     │                 │  Verify JWT      │                  │
     │                 │                  │                  │
     │                 │  Check user tier (free/premium)     │
     │                 │                  │                  │
     │                 │  Read audio file │                  │
     │                 ├─────────────────────────────────────>│
     │                 │                  │   /audio/{id}.mp3│
     │                 │                  │                  │
     │ 200 OK          │                  │                  │
     │ audio/mpeg      │                  │                  │
     │ (chunked transfer)                 │                  │
     │<────────────────┤                  │                  │
     │                 │                  │                  │
     │ Log playback event (async)         │                  │
     │                 │                  │                  │
     │                 │  INSERT INTO playback_events        │
     │                 │  (user_id, track_id, timestamp)     │
     │                 │                  │                  │
```

---

### 3.3 Offline Download Flow (Premium)

```
┌─────────┐       ┌─────────┐       ┌──────────┐
│ Browser │       │ Backend │       │   Files  │
│ (PWA)   │       │         │       │          │
└────┬────┘       └────┬────┘       └────┬─────┘
     │                 │                  │
     │ POST /playback/offline/license     │
     ├────────────────>│                  │
     │ {track_id}      │                  │
     │                 │                  │
     │                 │  Verify user is premium
     │                 │                  │
     │                 │  Generate encrypted token
     │                 │  (AES-256, expires in 30d)
     │                 │                  │
     │ 200 OK          │                  │
     │ {license_token, encrypted_url}     │
     │<────────────────┤                  │
     │                 │                  │
     │ GET encrypted_url (via fetch)      │
     ├────────────────────────────────────>│
     │                 │  /audio/{id}_enc.mp3
     │                 │                  │
     │ Download encrypted audio           │
     │<────────────────────────────────────┤
     │                 │                  │
     │ Store in IndexedDB:                │
     │ - audio blob (encrypted)           │
     │ - license_token                    │
     │ - expiry (30 days)                 │
     │                 │                  │
```

**Offline Playback:**
1. Check if `license_token` is valid (< 30 days old)
2. If expired, require user to come online and renew
3. Decrypt audio using token (AES-256-GCM)
4. Play decrypted audio in memory (Web Audio API)

---

## 4. Security Architecture

### 4.1 Authentication Flow

**JWT Structure:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "email": "user@example.com",
    "role": "user",
    "tier": "premium",
    "iat": 1704931200,
    "exp": 1704934800
  }
}
```

**Token Storage:**
- **Access Token:** localStorage (1-hour expiry)
- **Refresh Token:** httpOnly cookie (30-day expiry)

**OAuth Flow (Google):**
```
1. User clicks "Login with Google"
2. Redirect to Google OAuth consent screen
3. Google redirects back to /auth/oauth/google/callback?code=...
4. Backend exchanges code for user info
5. Create/login user, issue JWT
6. Redirect to app with token
```

---

### 4.2 API Security

**Rate Limiting (Nginx):**
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://backend:8000;
}
```

**CORS Policy:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://voiceofchitral.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

**Input Validation:**
- All API inputs validated via Pydantic schemas
- SQL injection prevented by SQLAlchemy ORM
- File uploads: whitelist extensions (.mp3, .flac, .wav)
- Max file size: 100 MB

---

### 4.3 DRM for Offline Mode

**Encryption:**
```python
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import os

def encrypt_audio(audio_bytes, user_id, track_id):
    # Derive key from user_id + track_id + secret
    key = derive_key(user_id, track_id)
    iv = os.urandom(16)

    cipher = Cipher(algorithms.AES(key), modes.GCM(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(audio_bytes) + encryptor.finalize()

    return {
        "ciphertext": ciphertext,
        "iv": iv,
        "tag": encryptor.tag
    }
```

**License Token:**
```json
{
  "track_id": "abc123",
  "user_id": "user456",
  "key": "base64_encrypted_key",
  "issued_at": "2025-01-09T00:00:00Z",
  "expires_at": "2025-02-09T00:00:00Z"
}
```

**Decryption (Client-Side):**
```javascript
async function decryptAudio(encryptedBlob, licenseToken) {
  const key = await importKey(licenseToken.key);
  const decrypted = await crypto.subtle.decrypt(
    {name: "AES-GCM", iv: licenseToken.iv},
    key,
    encryptedBlob
  );
  return new Blob([decrypted], {type: 'audio/mpeg'});
}
```

---

## 5. Deployment Architecture

### 5.1 VPS Specifications

**Recommended Provider:** DigitalOcean, Linode, Vultr, Hetzner

**Instance Size:**
- **CPU:** 2 vCPUs
- **RAM:** 4 GB
- **Storage:** 100 GB SSD
- **Bandwidth:** 4 TB/month
- **Cost:** ~$24/month

**OS:** Ubuntu 22.04 LTS

---

### 5.2 Docker Compose Services

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
      - ./media:/var/www/media
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./frontend
    environment:
      - VITE_API_URL=https://api.voiceofchitral.com
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/voiceofchitral
      - REDIS_URL=redis://redis:6379/0
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "8000:8000"
    volumes:
      - ./media:/app/media
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=voiceofchitral
      - POSTGRES_USER=voiceofchitral
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

### 5.3 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/voice-of-chitral
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker-compose exec backend alembic upgrade head
```

---

## 6. Monitoring & Observability

### 6.1 Metrics (Prometheus)

**Exported Metrics:**
```
# HTTP requests
http_requests_total{method, endpoint, status}
http_request_duration_seconds{method, endpoint}

# Database
db_connections_active
db_query_duration_seconds{query_type}

# Cache
redis_hits_total
redis_misses_total

# Business metrics
tracks_streamed_total
users_active_daily
premium_subscriptions_active
```

---

### 6.2 Dashboards (Grafana)

**Key Dashboards:**
1. **System Health:** CPU, RAM, disk, network
2. **Application Performance:** API response times, error rates
3. **Business Metrics:** DAU, streams, revenue
4. **Database:** Query performance, connection pool

---

### 6.3 Alerting

**Critical Alerts:**
- API error rate > 5% (5-minute window)
- Database CPU > 80% for 10 minutes
- Disk usage > 90%
- SSL certificate expires in < 7 days

**Notification Channels:**
- Email
- Slack webhook
- PagerDuty (production)

---

## 7. Disaster Recovery

### 7.1 Backup Strategy

**Database:**
- **Frequency:** Daily at 2 AM UTC
- **Retention:** 7 daily, 4 weekly, 12 monthly
- **Location:** Offsite S3 bucket

**Media Files:**
- **Frequency:** Weekly
- **Method:** rsync to backup VPS
- **Retention:** 4 weeks

**Code:**
- **Method:** Git repository (GitHub)
- **Branches:** `main`, `staging`, `develop`

---

### 7.2 Restore Procedure

**Database Restore:**
```bash
# Stop application
docker-compose stop backend

# Restore from backup
gunzip < /backups/db_20250109.sql.gz | \
  docker-compose exec -T postgres psql -U voiceofchitral

# Start application
docker-compose start backend
```

**Media Restore:**
```bash
rsync -av --progress backup-vps:/backups/media/ /var/www/media/
```

---

## 8. Performance Optimization

### 8.1 Caching Strategy

**Browser Caching (Nginx):**
```nginx
location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /api/tracks/ {
    expires 1h;
    add_header Cache-Control "public";
}
```

**Redis Caching:**
- Track metadata: 1 hour
- User sessions: 1 hour (sliding)
- Search results: 5 minutes
- Recommendations: 24 hours

---

### 8.2 Database Optimization

**Indexes:**
```sql
CREATE INDEX idx_tracks_title ON tracks USING GIN(to_tsvector('english', title));
CREATE INDEX idx_tracks_artist ON tracks(artist_id);
CREATE INDEX idx_playback_events_user_time ON playback_events(user_id, created_at DESC);
```

**Query Optimization:**
- Use `LIMIT` and `OFFSET` for pagination
- Avoid `SELECT *`, fetch only needed columns
- Use `JOIN` instead of multiple queries
- Implement query result caching in Redis

---

### 8.3 CDN Integration (Optional)

**CloudFlare Setup:**
1. Add domain to CloudFlare
2. Enable "Proxy" for DNS records
3. Configure Page Rules:
   - `/static/*` → Cache Everything
   - `/api/*` → Bypass Cache
4. Enable Brotli compression

---

## 9. Scalability Path

### 9.1 Vertical Scaling (0-1,000 users)
- Upgrade VPS to 8 GB RAM, 4 vCPUs
- Add Redis persistence (AOF)
- Enable PostgreSQL query cache

### 9.2 Horizontal Scaling (1,000-10,000 users)
- Separate database to dedicated VPS
- Add Redis Sentinel for HA
- Use load balancer (Nginx) with 2+ backend instances
- Move media to S3-compatible storage

### 9.3 Microservices (10,000+ users)
- Split backend into services: Auth, Catalog, Playback
- Use message queue (RabbitMQ, Redis Streams) for async tasks
- Implement read replicas for database
- Add Elasticsearch for advanced search

---

**Document End**

**Next Steps:** Database schema design → API specification → Sample code
