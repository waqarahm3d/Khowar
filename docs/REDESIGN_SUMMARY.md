# Voice of Chitral 2.0 - Complete Platform Redesign
**Status:** Architecture & Specification Phase
**Last Updated:** 2025-01-09

---

## 🎯 Overview

This is a **complete ground-up redesign** of the Voice of Chitral music streaming platform, optimized for single-VPS deployment with enterprise-grade features at lightweight scale.

---

## 📚 Deliverables Completed

### ✅ 1. Product Specification (PRODUCT_SPEC.md)
**14 pages** covering:
- Executive summary & user personas
- **16 detailed user stories** with acceptance criteria
- Authentication, music discovery, playback, library, offline mode
- Admin portal requirements
- Non-functional requirements (performance, security, scalability)
- Success metrics & KPIs
- MVP scope & future enhancements

**Key Features:**
- Email/OAuth authentication
- Spotify-like player with queue management
- Offline mode with DRM (premium)
- Playlist creation & sharing
- Artist following
- Admin portal for content management
- Subscription tiers (free vs. premium)

---

### ✅ 2. System Architecture (ARCHITECTURE.md)
**31 pages** covering:
- Complete architecture diagram (textual)
- 3-tier monolithic design (Frontend → Backend → Database)
- Technology stack:
  - **Frontend:** Flutter Web or Next.js + React + TailwindCSS
  - **Backend:** FastAPI (Python) with modular design
  - **Database:** PostgreSQL 15 + Redis 7
  - **Deployment:** Docker Compose on single VPS
- Data flow diagrams (login, playback, offline download)
- Security architecture (JWT, OAuth, DRM)
- Performance optimization strategies
- Monitoring & observability setup
- Scalability path (500 → 10,000+ users)

**Infrastructure:**
- Single VPS: 4 GB RAM, 2 vCPU, 100 GB SSD (~$24/month)
- Nginx reverse proxy with SSL (Let's Encrypt)
- Cloudflare CDN (optional)
- Prometheus + Grafana monitoring

---

### ✅ 3. Database Schema (DATABASE_SCHEMA.md)
**24 pages** covering:
- **11 core tables** with full SQL definitions:
  - `users` - Authentication & profiles
  - `artists` - Artist metadata
  - `albums` - Album collections
  - `tracks` - Individual songs
  - `playlists` - User playlists
  - `playlist_tracks` - Many-to-many junction
  - `user_likes` - Liked songs tracking
  - `user_follows` - Artist follows
  - `playback_events` - Analytics (partitioned by month)
  - `subscriptions` - Premium tiers
  - `sessions` - Active sessions
- Entity Relationship Diagram (ERD)
- Optimized indexes for performance
- Materialized views for trending content
- Triggers for auto-updates (play counts, track counts)
- Full-text search setup
- Sample queries (recently played, recommendations, search)
- Backup & maintenance scripts
- Storage estimates (~340 MB for 10K tracks, 1K users)

---

## 🚧 Deliverables In Progress

### 4. OpenAPI Specification
**Status:** Next in queue

Will include:
- Complete REST API documentation
- All endpoints with request/response schemas
- Authentication flows
- Error responses
- Example requests/responses

### 5. Sample Code Structure
**Status:** Pending

Will include:
- FastAPI backend scaffolding
- Flutter Web / Next.js frontend scaffolding
- Folder structures
- Key modules implemented

### 6. Docker Compose Configuration
**Status:** Pending

Will include:
- Complete docker-compose.yml
- Service definitions (nginx, frontend, backend, postgres, redis)
- Environment variable configuration
- Volume mounts
- Health checks

### 7. VPS Deployment Guide
**Status:** Pending

Will include:
- Step-by-step deployment instructions
- SSL setup with Let's Encrypt
- Environment configuration
- Initial data seeding
- Monitoring setup

### 8. 12-Week Implementation Roadmap
**Status:** Pending

Will include:
- Week-by-week task breakdown
- Milestones & deliverables
- Resource allocation
- Dependencies & risks

### 9. Technical Risks & Mitigations
**Status:** Pending

Will include:
- 10 major technical risks
- Impact assessment
- Mitigation strategies
- Contingency plans

---

## 🎯 Key Improvements Over Current System

### Architecture
| Old | New |
|-----|-----|
| Monolithic Node.js + React | Modular FastAPI + Flutter Web |
| No caching | Redis for sessions & hot data |
| Single database | PostgreSQL with partitioning |
| No monitoring | Prometheus + Grafana |
| Manual deployment | Docker Compose + CI/CD |

### Features
| Old | New |
|-----|-----|
| Basic playback | Queue, repeat, shuffle |
| No offline | Encrypted offline mode (premium) |
| No recommendations | Collaborative filtering |
| Basic search | Full-text search with ranking |
| Limited analytics | Real-time dashboards |

### Performance
| Old | New |
|-----|-----|
| Unoptimized queries | Indexed + materialized views |
| No caching | Multi-layer caching |
| No CDN | Optional Cloudflare CDN |
| ~5s playback start | < 2s target |
| No rate limiting | 100 req/min per IP |

### Security
| Old | New |
|-----|-----|
| Basic JWT | OAuth2 + refresh tokens |
| bcrypt | Argon2 password hashing |
| HTTP allowed | HTTPS only (Let's Encrypt) |
| No DRM | AES-256 encrypted offline |
| No rate limiting | Nginx rate limiting |

---

## 📊 System Capabilities

### Scalability Targets
- **Users:** 500 concurrent (MVP) → 10,000+ (Phase 2)
- **Tracks:** 1,000 songs (launch) → 100,000 (long-term)
- **Storage:** 100 GB (MVP) → 1 TB+ (cloud migration)
- **Bandwidth:** 1 TB/month → Unlimited (via CDN)

### Performance Targets
- **API Response:** < 100 ms (95th percentile)
- **Playback Start:** < 2 seconds (10 Mbps connection)
- **Page Load:** < 3 seconds (first load)
- **Search:** < 500 ms
- **Offline Sync:** < 5 seconds for playlist

### Uptime & Reliability
- **Target Uptime:** 99% (7.2 hours/month downtime allowed)
- **Backup:** Daily PostgreSQL dumps (7-day retention)
- **Recovery:** < 1 hour RTO (Recovery Time Objective)
- **Data Loss:** < 24 hours RPO (Recovery Point Objective)

---

## 🛠️ Technology Stack Summary

### Frontend
- **Framework:** Flutter Web (preferred) or Next.js 14 + React 18
- **Styling:** TailwindCSS
- **State:** Provider/Riverpod (Flutter) or Zustand (React)
- **PWA:** Service Worker + IndexedDB
- **Audio:** Howler.js (React) or Flutter audio_service

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **ORM:** SQLAlchemy 2.0
- **Migrations:** Alembic
- **Auth:** JWT + OAuth2 (Google, Facebook)
- **File Storage:** Local filesystem or S3-compatible
- **Task Queue:** Celery + Redis (for async jobs)

### Database & Cache
- **Primary DB:** PostgreSQL 15
- **Cache:** Redis 7
- **Search:** PostgreSQL full-text (tsvector)
- **Backups:** pg_dump + offsite S3

### Infrastructure
- **Server:** Ubuntu 22.04 LTS VPS (4GB RAM, 2 vCPU)
- **Reverse Proxy:** Nginx
- **SSL:** Let's Encrypt (Certbot)
- **Container:** Docker + Docker Compose
- **Monitoring:** Prometheus + Grafana
- **Logs:** JSON logs + Loki

### DevOps
- **CI/CD:** GitHub Actions
- **Deployment:** SSH + Docker Compose
- **Secrets:** Environment variables (.env files)
- **Backups:** Cron jobs + rsync

---

## 🗺️ Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Database schema setup
- Authentication system (email + OAuth)
- Basic API endpoints
- Admin upload interface
- Docker Compose configuration

### Phase 2: Core Features (Weeks 5-8)
- Music player with queue
- Search & browse
- Library management (playlists, likes)
- Artist profiles
- Recommendation engine

### Phase 3: Premium Features (Weeks 9-10)
- Subscription integration (Stripe)
- Offline mode with DRM
- Enhanced analytics
- Social sharing

### Phase 4: Polish & Launch (Weeks 11-12)
- Performance optimization
- Load testing (500 concurrent users)
- Security audit
- Monitoring dashboards
- Production deployment
- Documentation finalization

---

## 📋 Next Steps

1. ✅ Review & approve product spec, architecture, and database design
2. ⏳ **Create OpenAPI specification** (current)
3. ⏳ **Scaffold backend & frontend codebases**
4. ⏳ **Setup Docker Compose environment**
5. ⏳ **Write deployment automation**
6. ⏳ **Create implementation roadmap**
7. ⏳ **Begin development (Week 1)**

---

## 📈 Success Metrics for Redesign

### Technical
- [ ] All API endpoints < 100 ms response time
- [ ] Playback starts in < 2 seconds
- [ ] 500 concurrent users supported without degradation
- [ ] 99% uptime achieved
- [ ] Zero SQL injection vulnerabilities
- [ ] HTTPS enforced on all routes

### Business
- [ ] 1,000 registered users in 3 months
- [ ] 60% weekly active users (WAU/MAU)
- [ ] 5% free-to-premium conversion
- [ ] 40% day-30 user retention
- [ ] < $50/month operational costs

### User Experience
- [ ] PWA installable on mobile
- [ ] Offline mode works for premium users
- [ ] Search returns results in < 500 ms
- [ ] Player persists across page navigation
- [ ] Admin can upload 100 songs in < 5 minutes

---

## 🔗 Document Index

| Document | Pages | Status | Description |
|----------|-------|--------|-------------|
| [PRODUCT_SPEC.md](./PRODUCT_SPEC.md) | 14 | ✅ Complete | Product requirements & user stories |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 31 | ✅ Complete | System design & data flows |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | 24 | ✅ Complete | Database tables & relationships |
| OPENAPI_SPEC.md | TBD | 🚧 In Progress | REST API documentation |
| SAMPLE_CODE.md | TBD | ⏳ Pending | Backend & frontend scaffolding |
| DOCKER_COMPOSE.md | TBD | ⏳ Pending | Container configuration |
| DEPLOYMENT_GUIDE.md | TBD | ⏳ Pending | VPS setup instructions |
| IMPLEMENTATION_ROADMAP.md | TBD | ⏳ Pending | 12-week development plan |
| TECHNICAL_RISKS.md | TBD | ⏳ Pending | Risk assessment & mitigation |

---

## ✅ Approval Checklist

Before proceeding to implementation:

- [ ] Product spec reviewed & approved
- [ ] Architecture design approved
- [ ] Database schema validated
- [ ] Technology stack confirmed
- [ ] Budget approved (~$24/month VPS)
- [ ] Timeline realistic (12 weeks)
- [ ] Team resources allocated
- [ ] Legal (music licensing) addressed

---

**Status:** Awaiting review & approval to proceed with remaining deliverables

**Contact:** Development Team
**Last Updated:** 2025-01-09
