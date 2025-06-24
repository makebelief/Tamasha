# Tamasha Documentation

## Overview
Tamasha is a modern web application for streaming movies and TV shows, built with Next.js, TypeScript, and Tailwind CSS. The application features a responsive design, dark mode support, and integration with TMDB API for content.

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Integration](#api-integration)
- [Components](#components)
- [Styling](#styling)

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm/pnpm/yarn
- TMDB API access token

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd tamasha
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_access_token_here
```

4. Start the development server
```bash
pnpm dev
```

## Project Structure
```
tamasha/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...              # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and API clients
├── public/              # Static assets
└── styles/              # Global styles
```

## Features
- **Authentication**: User authentication and profile management
- **Movie/TV Show Browsing**: Browse and search content
- **Watchlist**: Save and manage favorite content
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in theme switching
- **Search**: Advanced search with filters

## API Integration
The application uses TMDB API for fetching movie and TV show data. Key endpoints:
- Movie/TV show details
- Search functionality
- Trending content
- Genre-based filtering
- Watch providers

## Components

### Core Components
- `AfroNavigation`: Main navigation component
- `FilmCard`: Reusable movie/show card
- `FilmDetailsView`: Detailed view for movies
- `SeriesDetailsView`: Detailed view for TV shows

### UI Components Library
- Form elements (buttons, inputs)
- Dialog components
- Navigation elements
- Content display components
- Utility components

## Styling
- Tailwind CSS for utility-first styling
- Custom theme variables
- Dark mode support
- Responsive design utilities 