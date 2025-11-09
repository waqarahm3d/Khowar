# Voice of Chitral - Product Specification
**Version:** 2.0
**Date:** 2025-01-09
**Document Type:** Product Requirements Document (PRD)

---

## 1. Executive Summary

Voice of Chitral is a **lightweight, self-hosted music streaming platform** designed to deliver Spotify-like experiences for Chitrali music on a single VPS. The platform supports web (mobile-responsive PWA), provides offline playback with basic DRM, and scales to 500 concurrent users.

**Key Differentiators:**
- Single VPS deployment (no cloud dependencies)
- Offline-first PWA with encrypted local caching
- Built-in admin portal for catalog management
- Lightweight stack optimized for low-resource environments
- Focus on regional Chitrali music content

---

## 2. User Personas

### 2.1 End User (Music Listener)
- **Demographics:** 18-45 years old, Chitrali diaspora worldwide
- **Goals:** Stream Chitrali music, create playlists, discover new artists
- **Pain Points:** Limited access to regional music, unreliable internet
- **Needs:** Fast playback, offline mode, simple UX

### 2.2 Artist/Creator
- **Demographics:** Local musicians, bands, singers
- **Goals:** Distribute music, reach audience, track engagement
- **Pain Points:** No platform for regional content
- **Needs:** Upload tracks, view analytics, manage profile

### 2.3 Administrator
- **Demographics:** Platform operator, content moderator
- **Goals:** Manage catalog, users, monitor platform health
- **Pain Points:** Manual content ingestion, moderation overhead
- **Needs:** Bulk upload, analytics dashboard, user management

---

## 3. User Stories & Acceptance Criteria

### 3.1 Authentication & Onboarding

#### US-001: User Registration
**As a** new visitor
**I want to** create an account with email/password or Google OAuth
**So that** I can access the platform and save my preferences

**Acceptance Criteria:**
- [ ] Email/password registration with confirmation email
- [ ] Google OAuth integration (1-click signup)
- [ ] Unique username validation
- [ ] Password strength requirements (min 8 chars, 1 number, 1 special)
- [ ] Email verification link expires in 24 hours
- [ ] User profile created with default preferences
- [ ] Registration completes in < 3 seconds

#### US-002: User Login
**As a** registered user
**I want to** log in securely
**So that** I can access my library and playlists

**Acceptance Criteria:**
- [ ] Email/password login
- [ ] Google OAuth login
- [ ] "Remember me" option (30-day session)
- [ ] Forgot password flow with email reset
- [ ] JWT token-based authentication
- [ ] Session persists across browser refresh
- [ ] Login completes in < 2 seconds

### 3.2 Music Discovery & Search

#### US-003: Browse Home Feed
**As a** logged-in user
**I want to** see personalized recommendations
**So that** I can discover new music matching my taste

**Acceptance Criteria:**
- [ ] Home feed loads in < 2 seconds
- [ ] Shows "Recently Played" (last 20 tracks)
- [ ] Shows "Recommended for You" (based on listening history)
- [ ] Shows "Popular Now" (trending tracks this week)
- [ ] Shows "New Releases" (added in last 30 days)
- [ ] Each section displays 10-20 items
- [ ] Smooth horizontal scroll on mobile
- [ ] Infinite scroll for recommendations

#### US-004: Search for Content
**As a** user
**I want to** search for songs, artists, and albums
**So that** I can quickly find specific content

**Acceptance Criteria:**
- [ ] Search returns results in < 500 ms
- [ ] Searches across: songs, artists, albums, playlists
- [ ] Supports partial matching and fuzzy search
- [ ] Results grouped by type (Songs, Artists, Albums)
- [ ] Shows top 5 results per category
- [ ] "View All" expands to full results
- [ ] Search history saved (last 10 queries)
- [ ] Works offline with cached content

### 3.3 Music Playback

#### US-005: Play a Song
**As a** user
**I want to** play a song with minimal latency
**So that** I can enjoy uninterrupted listening

**Acceptance Criteria:**
- [ ] Playback starts in < 2 seconds (on 10 Mbps connection)
- [ ] Audio quality: 128 kbps (free), 320 kbps (premium)
- [ ] Player UI shows: artwork, title, artist, progress bar
- [ ] Controls: play/pause, next, previous, seek, volume
- [ ] Player persists across page navigation
- [ ] Resume playback from last position on page reload
- [ ] Buffering indicator during loading
- [ ] Error handling for failed playback

#### US-006: Manage Playback Queue
**As a** user
**I want to** view and reorder my play queue
**So that** I can control what plays next

**Acceptance Criteria:**
- [ ] Queue shows next 50 tracks
- [ ] Drag-and-drop to reorder
- [ ] "Add to Queue" from song context menu
- [ ] "Play Next" vs "Add to End of Queue" options
- [ ] Clear queue button
- [ ] Queue persists across sessions
- [ ] Visual indicator for currently playing track

#### US-007: Repeat & Shuffle
**As a** user
**I want to** enable repeat and shuffle modes
**So that** I can customize my listening experience

**Acceptance Criteria:**
- [ ] Repeat modes: Off, Repeat All, Repeat One
- [ ] Shuffle button randomizes queue
- [ ] Shuffle respects current playing track
- [ ] Visual indicator for active modes
- [ ] Modes persist across sessions
- [ ] Works with playlists and albums

### 3.4 Library Management

#### US-008: Like Songs
**As a** user
**I want to** like songs
**So that** I can build my personal collection

**Acceptance Criteria:**
- [ ] Heart icon toggles like status
- [ ] Liked songs appear in "Liked Songs" library
- [ ] Like action completes in < 500 ms
- [ ] Works offline (syncs when online)
- [ ] Unlimited likes for all users
- [ ] Sort liked songs by: Recently Added, Title, Artist

#### US-009: Create & Manage Playlists
**As a** user
**I want to** create custom playlists
**So that** I can organize music by mood or theme

**Acceptance Criteria:**
- [ ] Create playlist with name and optional description
- [ ] Add songs via drag-drop or context menu
- [ ] Reorder songs within playlist
- [ ] Remove songs from playlist
- [ ] Delete playlist
- [ ] Edit playlist name/description/cover
- [ ] Make playlist public or private
- [ ] Playlist supports up to 10,000 songs
- [ ] Changes sync in < 1 second

#### US-010: Follow Artists
**As a** user
**I want to** follow artists
**So that** I stay updated on new releases

**Acceptance Criteria:**
- [ ] Follow button on artist page
- [ ] Followed artists appear in Library
- [ ] Notifications for new releases (optional)
- [ ] Unfollow option
- [ ] View all followed artists (sorted alphabetically)
- [ ] Artist follow count visible

### 3.5 Offline Mode (Premium)

#### US-011: Download Songs for Offline
**As a** premium user
**I want to** download songs for offline playback
**So that** I can listen without internet

**Acceptance Criteria:**
- [ ] Download button on songs/playlists/albums
- [ ] Downloaded content stored encrypted (AES-256)
- [ ] Offline playback license valid for 30 days
- [ ] Must come online once every 30 days to renew license
- [ ] Downloaded content limited to 10,000 songs
- [ ] Download progress indicator
- [ ] Manage downloads in Settings (view size, delete)
- [ ] Offline indicator in player
- [ ] Free users see upgrade prompt

### 3.6 Social Features

#### US-012: Share Playlists
**As a** user
**I want to** share playlists via link
**So that** friends can discover my music

**Acceptance Criteria:**
- [ ] Generate shareable link for public playlists
- [ ] Link opens playlist in web player (no login required)
- [ ] Option to make playlist public/private
- [ ] Copy link to clipboard
- [ ] Share via social media (WhatsApp, Facebook)
- [ ] View count on shared playlists
- [ ] Revoke share link option

### 3.7 Subscription & Payments

#### US-013: Upgrade to Premium
**As a** free user
**I want to** upgrade to premium
**So that** I can enjoy ad-free listening and offline mode

**Acceptance Criteria:**
- [ ] Clear comparison: Free vs Premium features
- [ ] Pricing: $4.99/month or $49.99/year
- [ ] Payment via Stripe (card, mobile wallets)
- [ ] Instant activation after payment
- [ ] Premium features: 320 kbps, offline, no ads, unlimited skips
- [ ] Subscription auto-renews monthly
- [ ] Cancel anytime (access until period ends)
- [ ] Receipt emailed after payment

### 3.8 Admin Portal

#### US-014: Upload Songs (Admin)
**As an** admin
**I want to** bulk upload songs with metadata
**So that** I can efficiently manage the catalog

**Acceptance Criteria:**
- [ ] Upload audio files (MP3, FLAC, WAV)
- [ ] Auto-extract ID3 tags (title, artist, album)
- [ ] Manual metadata editing
- [ ] Bulk upload via CSV + ZIP
- [ ] Upload progress bar
- [ ] Generate waveform and artwork thumbnails
- [ ] Set release date, genre, language
- [ ] Upload completes in < 5 seconds per song

#### US-015: Manage Users (Admin)
**As an** admin
**I want to** view and manage users
**So that** I can moderate the platform

**Acceptance Criteria:**
- [ ] View all users (paginated, 50 per page)
- [ ] Search users by email/username
- [ ] Filter by: status (active/banned), tier (free/premium)
- [ ] Ban/unban users
- [ ] View user activity (streams, playlists)
- [ ] Grant premium manually
- [ ] Export user list to CSV

#### US-016: View Analytics (Admin)
**As an** admin
**I want to** view platform analytics
**So that** I can track growth and engagement

**Acceptance Criteria:**
- [ ] Dashboard shows: total users, active users (7d), total streams (30d)
- [ ] Top 10 tracks (by streams this week)
- [ ] Top 10 artists (by followers)
- [ ] Daily stream count chart (last 30 days)
- [ ] User growth chart (last 90 days)
- [ ] Revenue summary (premium subscriptions)
- [ ] Export data to CSV
- [ ] Real-time updates (refresh every 30s)

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Playback Latency:** < 2 seconds on 10 Mbps connection
- **API Response Time:** < 100 ms (avg) for 95th percentile
- **Page Load Time:** < 3 seconds for initial load
- **Concurrent Users:** Support 500 simultaneous streams
- **Database Queries:** < 50 ms for song metadata retrieval

### 4.2 Scalability
- **Storage:** 100 GB SSD (supports ~1,000 songs @ 100 MB avg)
- **Bandwidth:** 1 TB/month (supports ~10,000 streams @ 100 MB avg)
- **Caching:** Redis for sessions, recommendations, hot content
- **Horizontal Scaling:** Not required for MVP (single VPS)

### 4.3 Security
- **Authentication:** OAuth2 + JWT (HS256, 1-hour expiry)
- **Password Storage:** Argon2 hashing
- **HTTPS:** Required (Let's Encrypt)
- **DRM:** AES-256 encrypted offline cache with token-based license
- **RBAC:** User, Artist, Admin roles
- **Rate Limiting:** 100 requests/minute per IP

### 4.4 Availability
- **Uptime:** 99% target (allows 7.2 hours/month downtime)
- **Backup:** Nightly PostgreSQL backups (7-day retention)
- **Monitoring:** Uptime checks every 5 minutes
- **Failover:** Manual VPS restore from backups

### 4.5 Compatibility
- **Browsers:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile:** iOS Safari 14+, Chrome Android 90+
- **PWA:** Installable on mobile/desktop
- **Audio Formats:** MP3, FLAC, WAV (transcoded to MP3 for delivery)

### 4.6 Compliance
- **Copyright:** All content must be licensed or user-uploaded with rights
- **Privacy:** GDPR-compliant (data export, deletion on request)
- **Terms of Service:** Clearly displayed during signup
- **Cookie Policy:** Banner for EU visitors

---

## 5. Success Metrics

### 5.1 User Acquisition
- **Target:** 1,000 registered users in 3 months
- **Metric:** Daily signups
- **Tracking:** Google Analytics, database counts

### 5.2 Engagement
- **Target:** 60% weekly active users (WAU/MAU)
- **Metric:** Users who stream ≥1 song in last 7 days
- **Tracking:** PostgreSQL event logs

### 5.3 Retention
- **Target:** 40% day-30 retention
- **Metric:** Users who return 30 days after signup
- **Tracking:** Cohort analysis

### 5.4 Premium Conversion
- **Target:** 5% free-to-premium conversion
- **Metric:** Paid subscriptions / total users
- **Tracking:** Stripe webhooks, database

### 5.5 Performance
- **Target:** 95th percentile API response < 100 ms
- **Metric:** Nginx access logs, Prometheus
- **Tracking:** Grafana dashboards

---

## 6. MVP Scope (12 Weeks)

### In-Scope for MVP:
✅ User authentication (email/password + Google OAuth)
✅ Browse home feed (recommendations, trending)
✅ Search (songs, artists, albums)
✅ Music playback (web player with queue)
✅ Library (liked songs, playlists, followed artists)
✅ Playlist creation and management
✅ Offline mode for premium users
✅ Subscription tiers (free vs premium)
✅ Admin portal (upload songs, manage users, analytics)
✅ PWA support (installable, offline-capable)

### Out-of-Scope for MVP:
❌ Mobile apps (iOS/Android)
❌ Live radio / podcasts
❌ User-generated content (UGC) uploads
❌ Comments / reviews on tracks
❌ Collaborative playlists
❌ In-app messaging
❌ Advanced analytics (cohort analysis, A/B testing)
❌ Multi-language UI (Chitral-only for MVP)

---

## 7. Risks & Assumptions

### 7.1 Risks
1. **Licensing:** Music catalog must be legally licensed
2. **Performance:** Single VPS may struggle with 500 concurrent users
3. **Storage:** 100 GB limit restricts catalog size
4. **DRM:** Offline encryption may be bypassed by determined users

### 7.2 Assumptions
1. **Target Audience:** Primarily Chitrali diaspora with moderate internet
2. **Content:** Catalog will start with 500-1,000 songs
3. **Payment:** Stripe available in target regions
4. **Infrastructure:** VPS is reliable (DigitalOcean, Linode, etc.)

---

## 8. Future Enhancements (Post-MVP)

**Phase 2 (3-6 months post-launch):**
- Mobile apps (Flutter iOS/Android)
- Artist dashboard (upload own tracks, view royalties)
- User-generated playlists (community curation)
- Enhanced recommendations (ML-based collaborative filtering)

**Phase 3 (6-12 months post-launch):**
- Live radio streams
- Podcast support
- Multi-language UI (Urdu, English)
- API for third-party integrations

---

**Document End**
**Next Steps:** Review with stakeholders → Architecture design → Database schema → Development kickoff
