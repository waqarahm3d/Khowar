#!/bin/bash

# Pakistani Music App Setup Script
# This script sets up the complete Pakistani music application with cultural elements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Pakistani flag colors
PAKISTAN_GREEN='\033[0;32m'
WHITE='\033[1;37m'

# Function to print colored output
print_colored() {
    printf "${1}${2}${NC}\n"
}

# Function to print Pakistani-themed header
print_header() {
    echo ""
    print_colored $PAKISTAN_GREEN "🇵🇰 ========================================"
    print_colored $WHITE "   Pakistani Music App Setup"
    print_colored $PAKISTAN_GREEN "   قوقنوز پورٹل - پاکستانی موسیقی ایپ"
    print_colored $PAKISTAN_GREEN "======================================== 🇵🇰"
    echo ""
}

# Function to print step header
print_step() {
    print_colored $CYAN "🎵 $1"
}

# Function to print success message
print_success() {
    print_colored $GREEN "✅ $1"
}

# Function to print warning message
print_warning() {
    print_colored $YELLOW "⚠️  $1"
}

# Function to print error message
print_error() {
    print_colored $RED "❌ $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    print_step "Checking system requirements..."
    
    local missing_deps=()
    
    # Check Node.js
    if ! command_exists node; then
        missing_deps+=("Node.js (v18+)")
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -lt 18 ]; then
            missing_deps+=("Node.js (current: v$NODE_VERSION, required: v18+)")
        fi
    fi
    
    # Check npm
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    # Check Docker
    if ! command_exists docker; then
        missing_deps+=("Docker")
    fi
    
    # Check Docker Compose
    if ! command_exists docker-compose; then
        missing_deps+=("Docker Compose")
    fi
    
    # Check Git
    if ! command_exists git; then
        missing_deps+=("Git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        print_error "Please install the missing dependencies and run the setup again."
        exit 1
    fi
    
    print_success "All system requirements are met!"
}

# Function to setup environment variables
setup_environment() {
    print_step "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
        
        # Generate random JWT secret
        JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
        sed -i "s/your-super-secret-jwt-key-for-pakistani-music-app-change-this-in-production/$JWT_SECRET/g" .env
        
        # Generate random encryption key
        ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
        sed -i "s/your-32-character-encryption-key/$ENCRYPTION_KEY/g" .env
        
        # Generate random session secret
        SESSION_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
        sed -i "s/your-session-secret-key/$SESSION_SECRET/g" .env
        
        print_success "Environment file created with secure random secrets!"
        print_warning "Please edit .env file to configure your cloud storage and other services."
    else
        print_success "Environment file already exists."
    fi
}

# Function to install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    # Install root dependencies
    print_colored $BLUE "Installing root dependencies..."
    npm install
    
    # Install admin backend dependencies
    print_colored $BLUE "Installing admin backend dependencies..."
    cd admin-backend
    npm install
    cd ..
    
    # Install web admin dependencies
    print_colored $BLUE "Installing web admin dependencies..."
    cd web-admin
    npm install
    cd ..
    
    # Install mobile app dependencies
    print_colored $BLUE "Installing mobile app dependencies..."
    cd mobile-app
    npm install
    cd ..
    
    print_success "All dependencies installed!"
}

# Function to setup database
setup_database() {
    print_step "Setting up database..."
    
    # Start PostgreSQL container
    print_colored $BLUE "Starting PostgreSQL container..."
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    print_colored $BLUE "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Run database migrations
    print_colored $BLUE "Running database migrations..."
    cd admin-backend
    npm run db:generate
    npm run db:push
    cd ..
    
    print_success "Database setup completed!"
}

# Function to setup Redis
setup_redis() {
    print_step "Setting up Redis cache..."
    
    # Start Redis container
    print_colored $BLUE "Starting Redis container..."
    docker-compose up -d redis
    
    # Wait for Redis to be ready
    print_colored $BLUE "Waiting for Redis to be ready..."
    sleep 5
    
    print_success "Redis cache setup completed!"
}

# Function to setup MinIO (S3-compatible storage)
setup_minio() {
    print_step "Setting up MinIO S3-compatible storage..."
    
    # Start MinIO container
    print_colored $BLUE "Starting MinIO container..."
    docker-compose up -d minio
    
    # Wait for MinIO to be ready
    print_colored $BLUE "Waiting for MinIO to be ready..."
    sleep 10
    
    print_success "MinIO storage setup completed!"
    print_colored $CYAN "MinIO Console: http://localhost:9001 (minioadmin/minioadmin123)"
}

# Function to setup Elasticsearch
setup_elasticsearch() {
    print_step "Setting up Elasticsearch for search functionality..."
    
    # Start Elasticsearch container
    print_colored $BLUE "Starting Elasticsearch container..."
    docker-compose up -d elasticsearch
    
    # Wait for Elasticsearch to be ready
    print_colored $BLUE "Waiting for Elasticsearch to be ready..."
    sleep 15
    
    print_success "Elasticsearch setup completed!"
}

# Function to create initial admin user
create_admin_user() {
    print_step "Creating initial admin user..."
    
    # Start the backend service
    print_colored $BLUE "Starting admin backend..."
    docker-compose up -d admin-backend
    
    # Wait for backend to be ready
    print_colored $BLUE "Waiting for backend to be ready..."
    sleep 10
    
    # Create admin user (you can customize this)
    print_colored $BLUE "Creating admin user..."
    
    # Note: In a real implementation, you would run a script to create the admin user
    # For now, we'll just print instructions
    print_colored $CYAN "Please create an admin user manually after the setup is complete."
    print_colored $CYAN "You can do this through the admin dashboard or API."
    
    print_success "Admin user setup instructions provided!"
}

# Function to setup monitoring
setup_monitoring() {
    print_step "Setting up monitoring and analytics..."
    
    # Start Prometheus and Grafana
    print_colored $BLUE "Starting monitoring services..."
    docker-compose up -d prometheus grafana
    
    # Wait for services to be ready
    print_colored $BLUE "Waiting for monitoring services to be ready..."
    sleep 10
    
    print_success "Monitoring setup completed!"
    print_colored $CYAN "Prometheus: http://localhost:9090"
    print_colored $CYAN "Grafana: http://localhost:3002 (admin/admin123)"
}

# Function to setup cultural data
setup_cultural_data() {
    print_step "Setting up Pakistani cultural data..."
    
    # Create cultural data directory
    mkdir -p admin-backend/data/cultural
    
    # Create sample cultural events data
    cat > admin-backend/data/cultural/events.json << EOF
[
  {
    "name": "Eid ul-Fitr",
    "nameUrdu": "عید الفطر",
    "type": "eid",
    "description": "Festival marking the end of Ramadan",
    "isRecurring": true,
    "culturalTags": ["celebration", "religious", "family"],
    "region": "pakistan"
  },
  {
    "name": "Eid ul-Adha",
    "nameUrdu": "عید الاضحیٰ",
    "type": "eid",
    "description": "Festival of Sacrifice",
    "isRecurring": true,
    "culturalTags": ["celebration", "religious", "sacrifice"],
    "region": "pakistan"
  },
  {
    "name": "Basant",
    "nameUrdu": "بسنت",
    "type": "basant",
    "description": "Kite flying festival",
    "isRecurring": true,
    "culturalTags": ["celebration", "cultural", "spring"],
    "region": "punjab"
  },
  {
    "name": "Shandur Polo Festival",
    "nameUrdu": "شندور پولو فیسٹیول",
    "type": "cultural",
    "description": "Traditional polo festival in northern Pakistan",
    "isRecurring": true,
    "culturalTags": ["sports", "cultural", "tradition"],
    "region": "gilgit-baltistan"
  }
]
EOF
    
    # Create sample Pakistani music genres data
    cat > admin-backend/data/cultural/genres.json << EOF
[
  {
    "name": "Qawwali",
    "nameUrdu": "قوالی",
    "description": "Sufi devotional music",
    "culturalSignificance": "high",
    "region": "pakistan",
    "characteristics": ["spiritual", "devotional", "group-singing"]
  },
  {
    "name": "Ghazal",
    "nameUrdu": "غزل",
    "description": "Poetic form of music",
    "culturalSignificance": "high",
    "region": "pakistan",
    "characteristics": ["poetry", "romantic", "classical"]
  },
  {
    "name": "Folk",
    "nameUrdu": "لوک",
    "description": "Traditional folk music",
    "culturalSignificance": "high",
    "region": "pakistan",
    "characteristics": ["traditional", "regional", "storytelling"]
  },
  {
    "name": "Sufi",
    "nameUrdu": "صوفی",
    "description": "Mystical Islamic music",
    "culturalSignificance": "high",
    "region": "pakistan",
    "characteristics": ["spiritual", "mystical", "devotional"]
  },
  {
    "name": "Classical",
    "nameUrdu": "کلاسیکی",
    "description": "Classical Pakistani music",
    "culturalSignificance": "high",
    "region": "pakistan",
    "characteristics": ["traditional", "sophisticated", "instrumental"]
  }
]
EOF
    
    print_success "Cultural data setup completed!"
}

# Function to build and start all services
start_services() {
    print_step "Building and starting all services..."
    
    # Build and start all services
    print_colored $BLUE "Building Docker images..."
    docker-compose build
    
    print_colored $BLUE "Starting all services..."
    docker-compose up -d
    
    # Wait for all services to be ready
    print_colored $BLUE "Waiting for all services to be ready..."
    sleep 30
    
    print_success "All services are running!"
}

# Function to display final information
display_final_info() {
    print_header
    print_colored $PAKISTAN_GREEN "🎉 Pakistani Music App Setup Complete! 🎉"
    echo ""
    print_colored $WHITE "Application URLs:"
    print_colored $CYAN "🎵 Admin Backend API: http://localhost:3000"
    print_colored $CYAN "🎛️  Web Admin Dashboard: http://localhost:3001"
    print_colored $CYAN "📊 Monitoring (Grafana): http://localhost:3002"
    print_colored $CYAN "🔍 Elasticsearch: http://localhost:9200"
    print_colored $CYAN "📦 MinIO Console: http://localhost:9001"
    print_colored $CYAN "📧 MailHog: http://localhost:8025"
    echo ""
    print_colored $WHITE "Default Credentials:"
    print_colored $CYAN "📦 MinIO: minioadmin / minioadmin123"
    print_colored $CYAN "📊 Grafana: admin / admin123"
    echo ""
    print_colored $WHITE "Cultural Features:"
    print_colored $PAKISTAN_GREEN "🇵🇰 Pakistani flag colors (Green & White)"
    print_colored $PAKISTAN_GREEN "🎨 Traditional cultural themes"
    print_colored $PAKISTAN_GREEN "🌍 Multi-language support (Urdu, English, etc.)"
    print_colored $PAKISTAN_GREEN "🎭 Cultural events and festivals"
    print_colored $PAKISTAN_GREEN "🎵 Pakistani music genres (Qawwali, Ghazal, Folk)"
    print_colored $PAKISTAN_GREEN "☁️  Multi-cloud storage support"
    echo ""
    print_colored $WHITE "Next Steps:"
    print_colored $YELLOW "1. Edit .env file to configure your cloud storage"
    print_colored $YELLOW "2. Create an admin user through the web dashboard"
    print_colored $YELLOW "3. Upload some Pakistani music to test the system"
    print_colored $YELLOW "4. Configure your mobile app to connect to the backend"
    print_colored $YELLOW "5. Customize cultural themes and translations"
    echo ""
    print_colored $PAKISTAN_GREEN "Made with ❤️ in Pakistan 🇵🇰"
    print_colored $WHITE "For support: support@qoqnuz.com"
    echo ""
}

# Function to handle cleanup on exit
cleanup() {
    if [ $? -ne 0 ]; then
        print_error "Setup failed. Cleaning up..."
        docker-compose down
    fi
}

# Main setup function
main() {
    # Set up trap for cleanup
    trap cleanup EXIT
    
    # Print header
    print_header
    
    # Check if running as root (not recommended)
    if [ "$EUID" -eq 0 ]; then
        print_warning "Running as root is not recommended. Consider using a regular user."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Run setup steps
    check_requirements
    setup_environment
    install_dependencies
    setup_database
    setup_redis
    setup_minio
    setup_elasticsearch
    setup_cultural_data
    setup_monitoring
    start_services
    create_admin_user
    
    # Display final information
    display_final_info
    
    # Remove trap
    trap - EXIT
}

# Parse command line arguments
case "${1:-}" in
    "clean")
        print_step "Cleaning up Docker containers and volumes..."
        docker-compose down -v
        docker system prune -f
        print_success "Cleanup completed!"
        ;;
    "restart")
        print_step "Restarting services..."
        docker-compose restart
        print_success "Services restarted!"
        ;;
    "logs")
        print_step "Showing logs..."
        docker-compose logs -f
        ;;
    "status")
        print_step "Checking service status..."
        docker-compose ps
        ;;
    "help"|"-h"|"--help")
        print_header
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  (no command)  Run full setup"
        echo "  clean         Clean up Docker containers and volumes"
        echo "  restart       Restart all services"
        echo "  logs          Show service logs"
        echo "  status        Show service status"
        echo "  help          Show this help message"
        echo ""
        ;;
    *)
        main
        ;;
esac