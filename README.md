# Pakistani Music App - Qoqnuz Portal

A comprehensive mobile music application with admin backend, featuring traditional Pakistani cultural elements, offline capabilities, and multi-cloud storage integration.

## 🎵 Features

### Mobile App Features
- **Music Streaming**: High-quality audio streaming with progressive download
- **Offline Playback**: Download songs for offline listening
- **Cultural Themes**: Dark/Light themes with Pakistani cultural elements
- **Multi-language Support**: Urdu, English, and regional languages
- **Playlist Management**: Create, edit, and share playlists
- **Advanced Search**: Search by artist, album, genre, or lyrics
- **Social Features**: Share songs and playlists with friends

### Admin Backend Features
- **Media Management**: Upload, organize, and manage music files
- **User Management**: Comprehensive user account administration
- **Analytics Dashboard**: Detailed usage statistics and insights
- **Content Moderation**: Review and approve user-generated content
- **Multi-Cloud Storage**: Manage files across S3, Wasabi, Backblaze, and Google Drive
- **Revenue Tracking**: Monitor subscriptions and revenue streams

### Pakistani Cultural Elements
- **Traditional Colors**: Green & white theme with saffron and gold accents
- **Urdu Typography**: Beautiful Urdu fonts and Arabic calligraphy
- **Cultural Motifs**: Islamic geometric patterns and traditional designs
- **Regional Content**: Support for Pakistani music genres and artists
- **Festival Themes**: Special themes for Eid, Basant, and other celebrations

## 🏗️ Architecture

```
pakistani-music-app/
├── mobile-app/          # React Native mobile application
├── admin-backend/       # Node.js admin backend with Express
├── web-admin/          # React.js admin dashboard
├── shared/             # Shared utilities and types
├── docs/               # Documentation and API specs
└── deployment/         # Docker and deployment configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio / Xcode
- PostgreSQL
- Redis

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pakistani-music-app
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development servers**
```bash
# Start backend
npm run dev:backend

# Start web admin (new terminal)
npm run dev:admin

# Start mobile app (new terminal)
npm run dev:mobile
```

## 🎨 Cultural Design System

### Color Palette
- **Primary Green**: #01411C (Pakistan Flag Green)
- **Secondary White**: #FFFFFF (Pakistan Flag White)
- **Accent Saffron**: #FF9933 (Traditional Saffron)
- **Gold**: #FFD700 (Premium Accent)
- **Deep Blue**: #1E3A8A (Trust & Stability)

### Typography
- **Urdu**: Noto Nastaliq Urdu, Jameel Noori Nastaliq
- **English**: Inter, SF Pro Display
- **Arabic**: Amiri, Scheherazade

### Cultural Motifs
- Islamic geometric patterns
- Traditional Pakistani textile designs
- Mughal architecture elements
- Truck art inspired graphics

## 🔧 Technology Stack

### Mobile App
- **Framework**: React Native
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Audio**: react-native-track-player
- **Storage**: AsyncStorage, SQLite
- **Networking**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **File Storage**: Multi-cloud abstraction layer
- **Cache**: Redis
- **Queue**: Bull Queue

### Admin Dashboard
- **Framework**: React.js
- **UI Library**: Ant Design with custom Pakistani theme
- **State Management**: Redux Toolkit
- **Charts**: Chart.js
- **File Upload**: react-dropzone

### Cloud Storage
- **Amazon S3**: Primary storage
- **Wasabi**: Cost-effective alternative
- **Backblaze B2**: Backup storage
- **Google Drive**: User cloud integration

## 📱 Mobile App Screenshots

[Screenshots will be added once the UI is implemented]

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Encryption**: Encrypted storage of sensitive data
- **CORS Protection**: Cross-origin request security
- **Input Validation**: Comprehensive input sanitization

## 🌍 Internationalization

- **Languages**: Urdu, English, Punjabi, Sindhi, Pashto
- **RTL Support**: Right-to-left text support for Urdu
- **Cultural Dates**: Islamic calendar integration
- **Regional Formats**: Pakistani number and date formats

## 📊 Analytics & Monitoring

- **User Analytics**: Listening patterns and preferences
- **Performance Monitoring**: App performance metrics
- **Error Tracking**: Comprehensive error logging
- **Business Intelligence**: Revenue and growth analytics

## 🚀 Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
# Build and deploy
npm run build
npm run deploy:production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Pakistani music industry for inspiration
- Traditional artists and cultural heritage
- Open source community for tools and libraries
- Beta testers and early adopters

## 📞 Support

For support, email support@qoqnuz.com or join our community Discord server.

---

**Made with ❤️ in Pakistan 🇵🇰**