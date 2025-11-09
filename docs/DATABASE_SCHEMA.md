# Voice of Chitral - Database Schema
**Version:** 2.0
**Database:** PostgreSQL 15
**ORM:** SQLAlchemy 2.0

---

## 1. Entity Relationship Diagram (ERD)

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│     users       │         │  playback_events │         │     tracks      │
├─────────────────┤         ├──────────────────┤         ├─────────────────┤
│ id (PK)         │────────<│ user_id (FK)     │>────────│ id (PK)         │
│ email           │         │ track_id (FK)    │         │ title           │
│ password_hash   │         │ played_at        │         │ duration        │
│ username        │         │ progress         │         │ file_path       │
│ display_name    │         │ source           │         │ artist_id (FK)  │
│ role            │         └──────────────────┘         │ album_id (FK)   │
│ tier            │                                       │ genre           │
│ created_at      │         ┌──────────────────┐         │ language        │
│ updated_at      │         │   user_likes     │         │ release_date    │
└─────────────────┘         ├──────────────────┤         │ play_count      │
                            │ user_id (FK)     │         │ created_at      │
                            │ track_id (FK)    │         └─────────────────┘
                            │ liked_at         │
                            └──────────────────┘                │
                                                                 │
┌─────────────────┐         ┌──────────────────┐               │
│    artists      │<────────│     albums       │<──────────────┘
├─────────────────┤         ├──────────────────┤
│ id (PK)         │         │ id (PK)          │
│ name            │         │ title            │
│ bio             │         │ artist_id (FK)   │
│ profile_image   │         │ release_date     │
│ follower_count  │         │ cover_image      │
│ verified        │         │ total_tracks     │
│ created_at      │         │ created_at       │
└─────────────────┘         └──────────────────┘

┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   playlists     │         │ playlist_tracks  │         │ user_follows     │
├─────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (PK)         │────────<│ playlist_id (FK) │         │ user_id (FK)     │
│ name            │         │ track_id (FK)    │         │ artist_id (FK)   │
│ description     │         │ position         │         │ followed_at      │
│ owner_id (FK)   │         │ added_at         │         └──────────────────┘
│ is_public       │         └──────────────────┘
│ cover_image     │
│ track_count     │         ┌──────────────────┐
│ created_at      │         │  subscriptions   │
│ updated_at      │         ├──────────────────┤
└─────────────────┘         │ id (PK)          │
                            │ user_id (FK)     │
                            │ tier             │
                            │ status           │
                            │ started_at       │
                            │ expires_at       │
                            │ stripe_sub_id    │
                            └──────────────────┘
```

---

## 2. Tables

### 2.1 Users Table

**Purpose:** Store user accounts and authentication data

```sql
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       VARCHAR(255),           -- Null for OAuth users
    username            VARCHAR(50) UNIQUE NOT NULL,
    display_name        VARCHAR(100) NOT NULL,
    profile_image       VARCHAR(500),
    role                VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'artist', 'admin')),
    tier                VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'premium')),
    oauth_provider      VARCHAR(50),            -- 'google', 'facebook', null
    oauth_id            VARCHAR(255),
    email_verified      BOOLEAN DEFAULT FALSE,
    is_active           BOOLEAN DEFAULT TRUE,
    last_login_at       TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Triggers
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Sample Data:**
```sql
INSERT INTO users (email, username, display_name, password_hash, role, tier) VALUES
('admin@voiceofchitral.com', 'admin', 'Admin User', '$argon2id$...', 'admin', 'premium'),
('user1@example.com', 'musiclover', 'Music Lover', '$argon2id$...', 'user', 'free');
```

---

### 2.2 Artists Table

**Purpose:** Store artist profiles and metadata

```sql
CREATE TABLE artists (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200) NOT NULL,
    bio                 TEXT,
    profile_image       VARCHAR(500),
    cover_image         VARCHAR(500),
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,  -- For verified artists
    verified            BOOLEAN DEFAULT FALSE,
    follower_count      INTEGER DEFAULT 0,
    monthly_listeners   INTEGER DEFAULT 0,
    genres              TEXT[],                  -- Array of genres
    social_links        JSONB,                   -- {facebook: '', instagram: ''}
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_artists_name ON artists USING GIN(to_tsvector('english', name));
CREATE INDEX idx_artists_verified ON artists(verified);
CREATE INDEX idx_artists_follower_count ON artists(follower_count DESC);

-- Sample Data
INSERT INTO artists (name, bio, verified, genres) VALUES
('Rehmat Aziz Chitrali', 'Legendary Chitrali singer known for traditional folk music', TRUE, ARRAY['Folk', 'Traditional']),
('Gulbahar Bano', 'Contemporary Chitrali artist', TRUE, ARRAY['Pop', 'Folk']);
```

---

### 2.3 Albums Table

**Purpose:** Store album information

```sql
CREATE TABLE albums (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(300) NOT NULL,
    artist_id           UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    release_date        DATE,
    cover_image         VARCHAR(500),
    total_tracks        INTEGER DEFAULT 0,
    album_type          VARCHAR(20) DEFAULT 'album' CHECK (album_type IN ('album', 'single', 'ep')),
    description         TEXT,
    genres              TEXT[],
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_albums_artist_id ON albums(artist_id);
CREATE INDEX idx_albums_release_date ON albums(release_date DESC);
CREATE INDEX idx_albums_title ON albums USING GIN(to_tsvector('english', title));

-- Sample Data
INSERT INTO albums (title, artist_id, release_date, album_type, total_tracks) VALUES
('Chitrali Folk Collection', (SELECT id FROM artists WHERE name = 'Rehmat Aziz Chitrali'), '2023-01-15', 'album', 12);
```

---

### 2.4 Tracks Table

**Purpose:** Store individual songs/tracks

```sql
CREATE TABLE tracks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(300) NOT NULL,
    artist_id           UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    album_id            UUID REFERENCES albums(id) ON DELETE SET NULL,
    duration            INTEGER NOT NULL,        -- Duration in seconds
    file_path           VARCHAR(500) NOT NULL,   -- Path to audio file
    file_size           BIGINT,                  -- File size in bytes
    file_format         VARCHAR(10),             -- 'mp3', 'flac', etc.
    bitrate             INTEGER,                 -- e.g., 320 (kbps)
    cover_image         VARCHAR(500),
    lyrics              TEXT,
    genre               VARCHAR(100),
    language            VARCHAR(50) DEFAULT 'Khowar',
    release_date        DATE,
    track_number        INTEGER,                 -- Position in album
    play_count          INTEGER DEFAULT 0,
    like_count          INTEGER DEFAULT 0,
    is_explicit         BOOLEAN DEFAULT FALSE,
    is_published        BOOLEAN DEFAULT TRUE,
    waveform_data       JSONB,                   -- Peaks for visualization
    metadata            JSONB,                   -- Additional ID3 tags
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tracks_title ON tracks USING GIN(to_tsvector('english', title));
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_album_id ON tracks(album_id);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_play_count ON tracks(play_count DESC);
CREATE INDEX idx_tracks_release_date ON tracks(release_date DESC);
CREATE INDEX idx_tracks_created_at ON tracks(created_at DESC);

-- Sample Data
INSERT INTO tracks (title, artist_id, album_id, duration, file_path, genre, play_count) VALUES
('Chitral Di Badshahi', (SELECT id FROM artists LIMIT 1), (SELECT id FROM albums LIMIT 1), 245, '/audio/track001.mp3', 'Folk', 15420);
```

---

### 2.5 Playlists Table

**Purpose:** Store user-created playlists

```sql
CREATE TABLE playlists (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                VARCHAR(200) NOT NULL,
    description         TEXT,
    owner_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_image         VARCHAR(500),
    is_public           BOOLEAN DEFAULT TRUE,
    is_collaborative    BOOLEAN DEFAULT FALSE,
    track_count         INTEGER DEFAULT 0,
    total_duration      INTEGER DEFAULT 0,       -- Total duration in seconds
    follower_count      INTEGER DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_playlists_owner_id ON playlists(owner_id);
CREATE INDEX idx_playlists_is_public ON playlists(is_public);
CREATE INDEX idx_playlists_created_at ON playlists(created_at DESC);

-- Sample Data
INSERT INTO playlists (name, description, owner_id, is_public) VALUES
('My Favorites', 'My all-time favorite Chitrali songs', (SELECT id FROM users WHERE username = 'musiclover'), TRUE);
```

---

### 2.6 Playlist Tracks Table (Junction Table)

**Purpose:** Map tracks to playlists with ordering

```sql
CREATE TABLE playlist_tracks (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id         UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
    track_id            UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    position            INTEGER NOT NULL,        -- Order in playlist
    added_by            UUID REFERENCES users(id) ON DELETE SET NULL,
    added_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(playlist_id, track_id)
);

-- Indexes
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id, position);
CREATE INDEX idx_playlist_tracks_track_id ON playlist_tracks(track_id);

-- Sample Data
INSERT INTO playlist_tracks (playlist_id, track_id, position, added_by) VALUES
((SELECT id FROM playlists LIMIT 1), (SELECT id FROM tracks LIMIT 1), 1, (SELECT id FROM users LIMIT 1));
```

---

### 2.7 User Likes Table (Junction Table)

**Purpose:** Track which users liked which tracks

```sql
CREATE TABLE user_likes (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    track_id            UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    liked_at            TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, track_id)
);

-- Indexes
CREATE INDEX idx_user_likes_user_id ON user_likes(user_id, liked_at DESC);
CREATE INDEX idx_user_likes_track_id ON user_likes(track_id);
```

---

### 2.8 User Follows Table (Junction Table)

**Purpose:** Track which users follow which artists

```sql
CREATE TABLE user_follows (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    artist_id           UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    followed_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, artist_id)
);

-- Indexes
CREATE INDEX idx_user_follows_user_id ON user_follows(user_id);
CREATE INDEX idx_user_follows_artist_id ON user_follows(artist_id);
```

---

### 2.9 Playback Events Table

**Purpose:** Log all song plays for analytics

```sql
CREATE TABLE playback_events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    track_id            UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    played_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress            INTEGER,                 -- How much was played (seconds)
    completed           BOOLEAN DEFAULT FALSE,   -- TRUE if >30s or >50% played
    source              VARCHAR(50),             -- 'web', 'pwa', 'mobile'
    ip_address          INET,
    user_agent          TEXT
) PARTITION BY RANGE (played_at);

-- Partitions (monthly)
CREATE TABLE playback_events_2025_01 PARTITION OF playback_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE playback_events_2025_02 PARTITION OF playback_events
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Indexes (on each partition)
CREATE INDEX idx_playback_events_user_id ON playback_events(user_id, played_at DESC);
CREATE INDEX idx_playback_events_track_id ON playback_events(track_id, played_at DESC);
CREATE INDEX idx_playback_events_played_at ON playback_events(played_at DESC);
```

---

### 2.10 Subscriptions Table

**Purpose:** Track premium subscriptions

```sql
CREATE TABLE subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier                VARCHAR(20) NOT NULL CHECK (tier IN ('premium')),
    status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'past_due')),
    stripe_customer_id  VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    payment_method      VARCHAR(50),             -- 'card', 'mobile_wallet'
    amount              DECIMAL(10, 2),          -- Monthly amount
    currency            VARCHAR(3) DEFAULT 'USD',
    started_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at          TIMESTAMP WITH TIME ZONE,
    canceled_at         TIMESTAMP WITH TIME ZONE,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);
```

---

### 2.11 Sessions Table

**Purpose:** Store active user sessions (alternative to Redis-only storage)

```sql
CREATE TABLE sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token               VARCHAR(500) NOT NULL UNIQUE,
    refresh_token       VARCHAR(500),
    device_info         JSONB,                   -- {device, os, browser}
    ip_address          INET,
    expires_at          TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Auto-delete expired sessions
CREATE INDEX idx_sessions_cleanup ON sessions(expires_at) WHERE expires_at < NOW();
```

---

## 3. Views

### 3.1 Popular Tracks View

**Purpose:** Frequently queried "trending" tracks

```sql
CREATE MATERIALIZED VIEW popular_tracks AS
SELECT
    t.id,
    t.title,
    t.artist_id,
    a.name AS artist_name,
    t.cover_image,
    COUNT(pe.id) AS plays_last_7d,
    t.like_count
FROM tracks t
JOIN artists a ON t.artist_id = a.id
LEFT JOIN playback_events pe ON pe.track_id = t.id
    AND pe.played_at > NOW() - INTERVAL '7 days'
    AND pe.completed = TRUE
WHERE t.is_published = TRUE
GROUP BY t.id, a.name
ORDER BY plays_last_7d DESC
LIMIT 100;

-- Refresh daily
CREATE INDEX idx_popular_tracks_plays ON popular_tracks(plays_last_7d DESC);
REFRESH MATERIALIZED VIEW popular_tracks;
```

---

### 3.2 User Library View

**Purpose:** Simplified view of user's library

```sql
CREATE VIEW user_library AS
SELECT
    u.id AS user_id,
    u.username,
    (SELECT COUNT(*) FROM user_likes ul WHERE ul.user_id = u.id) AS liked_songs_count,
    (SELECT COUNT(*) FROM playlists p WHERE p.owner_id = u.id) AS playlist_count,
    (SELECT COUNT(*) FROM user_follows uf WHERE uf.user_id = u.id) AS following_count
FROM users u;
```

---

## 4. Functions & Triggers

### 4.1 Update `updated_at` Trigger Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (apply to all relevant tables)
```

---

### 4.2 Increment Play Count Function

```sql
CREATE OR REPLACE FUNCTION increment_play_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed = TRUE THEN
        UPDATE tracks
        SET play_count = play_count + 1
        WHERE id = NEW.track_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER playback_event_insert
AFTER INSERT ON playback_events
FOR EACH ROW
EXECUTE FUNCTION increment_play_count();
```

---

### 4.3 Update Track Count in Playlists

```sql
CREATE OR REPLACE FUNCTION update_playlist_track_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE playlists
        SET track_count = track_count + 1,
            total_duration = total_duration + (SELECT duration FROM tracks WHERE id = NEW.track_id)
        WHERE id = NEW.playlist_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE playlists
        SET track_count = track_count - 1,
            total_duration = total_duration - (SELECT duration FROM tracks WHERE id = OLD.track_id)
        WHERE id = OLD.playlist_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER playlist_tracks_insert
AFTER INSERT ON playlist_tracks
FOR EACH ROW
EXECUTE FUNCTION update_playlist_track_count();

CREATE TRIGGER playlist_tracks_delete
AFTER DELETE ON playlist_tracks
FOR EACH ROW
EXECUTE FUNCTION update_playlist_track_count();
```

---

## 5. Sample Queries

### 5.1 Get User's Recently Played Tracks

```sql
SELECT
    t.id,
    t.title,
    a.name AS artist_name,
    t.cover_image,
    MAX(pe.played_at) AS last_played
FROM tracks t
JOIN artists a ON t.artist_id = a.id
JOIN playback_events pe ON pe.track_id = t.id
WHERE pe.user_id = :user_id
GROUP BY t.id, a.name
ORDER BY last_played DESC
LIMIT 20;
```

---

### 5.2 Search Tracks (Full-Text Search)

```sql
SELECT
    t.id,
    t.title,
    a.name AS artist_name,
    t.cover_image,
    ts_rank(to_tsvector('english', t.title || ' ' || a.name), query) AS rank
FROM tracks t
JOIN artists a ON t.artist_id = a.id,
     plainto_tsquery('english', :search_query) AS query
WHERE to_tsvector('english', t.title || ' ' || a.name) @@ query
ORDER BY rank DESC
LIMIT 50;
```

---

### 5.3 Get User Recommendations (Collaborative Filtering)

```sql
-- Find users with similar taste
WITH similar_users AS (
    SELECT ul2.user_id, COUNT(*) AS shared_likes
    FROM user_likes ul1
    JOIN user_likes ul2 ON ul1.track_id = ul2.track_id
    WHERE ul1.user_id = :user_id AND ul2.user_id != :user_id
    GROUP BY ul2.user_id
    ORDER BY shared_likes DESC
    LIMIT 10
)
-- Get tracks liked by similar users but not by current user
SELECT DISTINCT
    t.id,
    t.title,
    a.name AS artist_name,
    t.cover_image,
    COUNT(*) AS recommendation_score
FROM user_likes ul
JOIN similar_users su ON ul.user_id = su.user_id
JOIN tracks t ON ul.track_id = t.id
JOIN artists a ON t.artist_id = a.id
WHERE ul.track_id NOT IN (
    SELECT track_id FROM user_likes WHERE user_id = :user_id
)
GROUP BY t.id, a.name
ORDER BY recommendation_score DESC, t.play_count DESC
LIMIT 50;
```

---

### 5.4 Get Top Tracks by Genre (Last 30 Days)

```sql
SELECT
    t.id,
    t.title,
    a.name AS artist_name,
    COUNT(pe.id) AS plays
FROM tracks t
JOIN artists a ON t.artist_id = a.id
LEFT JOIN playback_events pe ON pe.track_id = t.id
    AND pe.played_at > NOW() - INTERVAL '30 days'
    AND pe.completed = TRUE
WHERE t.genre = :genre AND t.is_published = TRUE
GROUP BY t.id, a.name
ORDER BY plays DESC
LIMIT 20;
```

---

## 6. Database Size Estimates

**Assumptions:**
- 10,000 tracks
- 1,000 users
- 100,000 playback events/month

| Table | Rows | Avg Row Size | Total Size |
|-------|------|--------------|------------|
| users | 1,000 | 500 bytes | 500 KB |
| artists | 500 | 1 KB | 500 KB |
| albums | 1,000 | 500 bytes | 500 KB |
| tracks | 10,000 | 1 KB | 10 MB |
| playlists | 5,000 | 500 bytes | 2.5 MB |
| playlist_tracks | 50,000 | 100 bytes | 5 MB |
| user_likes | 20,000 | 100 bytes | 2 MB |
| user_follows | 5,000 | 100 bytes | 500 KB |
| playback_events | 1.2M/year | 200 bytes | 240 MB/year |
| subscriptions | 50 | 300 bytes | 15 KB |
| **Total (1 year)** | | | **~260 MB** |

**Plus indexes (~30% overhead):** **~340 MB**

**Storage Recommendation:** 10 GB database volume (plenty of headroom)

---

## 7. Backup & Maintenance

### 7.1 Daily Backup

```bash
#!/bin/bash
# /opt/scripts/backup_db.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="voiceofchitral"

# Create backup
pg_dump -U voiceofchitral -d $DB_NAME -F c -f $BACKUP_DIR/db_$DATE.dump

# Compress
gzip $BACKUP_DIR/db_$DATE.dump

# Keep last 7 days
find $BACKUP_DIR -name "db_*.dump.gz" -mtime +7 -delete

echo "Backup completed: db_$DATE.dump.gz"
```

**Cron:**
```
0 2 * * * /opt/scripts/backup_db.sh >> /var/log/db_backup.log 2>&1
```

---

### 7.2 Vacuum & Analyze

```sql
-- Weekly maintenance
VACUUM ANALYZE;

-- Reindex
REINDEX DATABASE voiceofchitral;
```

---

**Document End**

**Next:** OpenAPI Specification → Sample Code → Docker Compose → Deployment Guide
