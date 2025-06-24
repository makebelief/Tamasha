# Tamasha - African Movie Discovery Platform

Tamasha is a modern web application for discovering and exploring African movies and TV shows. It provides a rich user interface for browsing, searching, and managing your watchlist of African content.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Features
- 🔍 Advanced search with autocomplete
- 🎬 Detailed movie and TV show information
- 📱 Responsive design for all devices
- 🌓 Dark/light theme support
- 📊 Advanced filtering by year, rating, and runtime

### User Features
- 📋 Personal watchlist management
- 📤 Export watchlist to PDF/CSV
- 🔔 Mark items as watched/unwatched
- 📱 Social sharing capabilities

### Integration Features
- 🎥 YouTube trailer integration
- 📺 Streaming provider availability
- 🌍 TMDB API integration
- 🔄 Real-time search updates

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **UI Components**: shadcn/ui
- **HTTP Client**: Native fetch with custom caching
- **PDF Generation**: jsPDF
- **Icons**: Lucide Icons

### Backend
- **Language**: Go
- **Web Framework**: Gorilla Mux
- **CORS**: rs/cors
- **API Integration**: TMDB API
- **Environment**: Configurable through environment variables

### Development Tools
- **Package Manager**: npm (frontend), Go modules (backend)
- **Build Tool**: Make
- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **Development Server**: Next.js dev server, Go live reload

## Prerequisites

- Node.js (v16 or higher)
- Go (v1.16 or higher)
- Make
- Git
- TMDB API Key (for movie data)

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/tamasha.git
   cd tamasha
   ```

2. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   NEXT_PUBLIC_METADATA_BASE=http://localhost:3000
   ```

3. **Quick Start**
   ```bash
   # Install dependencies and start development servers
   make dev
   ```

   Or run services individually:
   ```bash
   # Frontend only
   make run-frontend

   # Backend only
   make run-backend
   ```

## API Documentation

### Backend API Endpoints

#### Movies

```http
GET /api/movies/search
```
Search for movies with optional filters.

**Query Parameters:**
- `query` (string): Search term
- `year` (number): Filter by release year
- `rating` (number): Filter by minimum rating
- `page` (number): Page number for pagination

**Response:**
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "overview": "string",
      "poster_path": "string",
      "release_date": "string",
      "vote_average": number
    }
  ],
  "total_pages": number,
  "total_results": number
}
```

#### TV Shows

```http
GET /api/tv/search
```
Search for TV shows with optional filters.

**Query Parameters:** (same as movies)

#### Watch Providers

```http
GET /api/watch-providers/{media_type}/{id}
```
Get streaming availability for a movie or TV show.

**Path Parameters:**
- `media_type`: "movie" or "tv"
- `id`: TMDB ID of the content

**Response:**
```json
{
  "results": {
    "US": {
      "flatrate": [],
      "rent": [],
      "buy": []
    }
  }
}
```

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── providers.tsx      # Context providers
│   ├── search/           # Search functionality
│   ├── movie/            # Movie pages
│   ├── tv/              # TV show pages
│   └── watchlist/       # Watchlist pages
├── components/            # React components
│   ├── ui/              # Reusable UI components
│   └── ...              # Feature components
├── lib/                  # Utility functions
│   ├── tmdb.ts         # TMDB API client
│   └── utils.ts        # Helper functions
├── public/              # Static assets
├── backend/             # Go backend
│   ├── cmd/            # Entry points
│   ├── internal/       # Internal packages
│   └── pkg/            # Public packages
├── styles/             # Global styles
├── types/              # TypeScript types
├── Makefile           # Build scripts
└── README.md          # Documentation
```

## Development

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && go test ./...
```

### Adding New Features

1. Create a new branch
2. Implement the feature
3. Add tests
4. Update documentation
5. Submit a pull request

## Deployment

### Frontend Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Backend Deployment

1. Build the backend:
   ```bash
   cd backend
   go build -o server cmd/api/main.go
   ```

2. Run the server:
   ```bash
   ./server
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

Special thanks to:
- **Shayo Victor** - Creator and sole contributor of the Tamasha platform

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
