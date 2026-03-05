# 🎬 CineMetrics - Movie Sentiment Analysis Tool

A modern, AI-powered web application that analyzes movie sentiment using real IMDb reviews and Google Gemini AI to provide comprehensive audience insights.

## ✨ Features

- 🎬 **Movie Search**: Search movies by IMDb ID
- 🖼️ **Rich Movie Details**: Display posters, cast, ratings, genres, and metadata
- ⭐ **Real-Time Review Scraping**: Extract 15+ actual reviews from IMDb
- 🤖 **AI-Powered Analysis**: Google Gemini AI generates sentiment summaries
- 📊 **Smart Insights**: 4 key insights with confidence scoring
- 🎨 **Premium UI/UX**: Modern dark theme with cyan accents, glassmorphism effects
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- ✨ **Smooth Animations**: Framer Motion animations throughout
- 🔄 **Graceful Error Handling**: Comprehensive validation and user feedback

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.6 | React framework with App Router and API routes |
| **React** | 19 | UI component library |
| **TypeScript** | 5 | Type-safe development |
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **Framer Motion** | 11 | Smooth animations and transitions |
| **Axios** | 1.7.9 | HTTP client for API requests |
| **Cheerio** | 1.0.0 | Server-side HTML parsing for web scraping |
| **Lucide React** | 0.468.0 | Modern icon library |

| **Lucide React** | 0.468.0 | Modern icon library |

### 🎯 Tech Stack Rationale

#### **Next.js 16 with App Router**
- **Why**: Modern React framework with built-in API routes, server-side rendering, and excellent developer experience
- **Benefits**: 
  - API routes eliminate need for separate backend
  - Automatic code splitting and optimization
  - Built-in TypeScript support
  - Turbopack for faster builds

#### **TypeScript**
- **Why**: Type safety prevents runtime errors and improves code maintainability
- **Benefits**:
  - Catch errors at compile time
  - Better IDE autocompletion
  - Self-documenting code with interfaces

#### **Tailwind CSS**
- **Why**: Utility-first CSS framework for rapid UI development
- **Benefits**:
  - Responsive design with mobile-first approach
  - No CSS naming conflicts
  - Consistent design system
  - Small production bundle size

#### **Framer Motion**
- **Why**: Industry-standard animation library for React
- **Benefits**:
  - Simple declarative API
  - Performant animations
  - AnimatePresence for exit animations
  - Easy to create polished micro-interactions

#### **Google Gemini AI (gemini-2.5-flash)**
- **Why**: Free, powerful, and fast AI model for text analysis
- **Benefits**:
  - Free API with generous limits
  - Context-aware sentiment analysis
  - Fast response times (~3-5 seconds)
  - Supports long prompts (4096 tokens)
  - Graceful fallback to algorithmic analysis

#### **Axios + Cheerio**
- **Why**: Robust solution for web scraping IMDb reviews
- **Benefits**:
  - Axios: Reliable HTTP client with interceptors
  - Cheerio: jQuery-like API for parsing HTML
  - Works on server-side (Next.js API routes)
  - Handles dynamic IMDb HTML structure

#### **OMDb API**
- **Why**: Reliable source for movie metadata
- **Benefits**:
  - Free tier available
  - Comprehensive movie information
  - Fast response times
  - No rate limiting on free tier

---

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have:
- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm**, yarn, pnpm, or bun package manager
- **OMDb API Key** ([Get Free Key](http://www.omdbapi.com/apikey.aspx))
- **Google Gemini API Key** ([Get Free Key](https://aistudio.google.com/app/apikey))

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd movie-sentiment-app
```

### Step 2: Install Dependencies

```bash
npm install
```

**What gets installed:**
- Next.js framework and React libraries
- TypeScript compiler and types
- Tailwind CSS and PostCSS
- Framer Motion for animations
- Axios and Cheerio for web scraping
- Lucide React for icons

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Add your API keys to `.env.local`:

```env
# OMDb API Key (Get yours at http://www.omdbapi.com/apikey.aspx)
OMDB_API_KEY=your_omdb_api_key_here

# Google Gemini API Key (FREE - Get at https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Getting API Keys:

1. **OMDb API Key** (Required):
   - Go to http://www.omdbapi.com/apikey.aspx
   - Select "FREE" tier (1,000 daily requests)
   - Enter your email and verify
   - Copy the API key from your email

2. **Gemini API Key** (Optional but Recommended):
   - Go to https://aistudio.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the generated key
   - **Note**: Without this, the app uses algorithmic sentiment analysis (still functional)

### Step 4: Run Development Server

```bash
npm run dev
```

The app will be available at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.x.x:3000 (accessible from other devices on same network)

### Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Try one of these IMDb IDs:
   - `tt0133093` - The Matrix (Positive)
   - `tt0111161` - The Shawshank Redemption (Positive)
   - `tt0068646` - The Godfather (Positive)
   - `tt0468569` - The Dark Knight (Positive)
3. Wait 5-10 seconds for:
   - Movie data to load (OMDb API)
   - Reviews to be scraped (IMDb)
   - AI sentiment analysis (Gemini)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📋 Assumptions Made

### 1. **IMDb Structure**
- **Assumption**: IMDb review page HTML structure uses `.user-review-item` class for review containers
- **Rationale**: Based on current IMDb website structure (as of 2026)
- **Fallback**: Multiple selector fallbacks implemented if structure changes

### 2. **API Availability**
- **Assumption**: OMDb API and Gemini AI API are accessible and operational
- **Rationale**: Both are reliable services with high uptime
- **Fallback**: Graceful error handling and user feedback if APIs fail

### 3. **API Rate Limits**
- **Assumption**: User won't exceed free tier limits (1,000 OMDb requests/day, generous Gemini limits)
- **Rationale**: Typical development/testing usage stays well within limits
- **Recommendation**: Implement caching for production deployments

### 4. **Review Language**
- **Assumption**: IMDb reviews are primarily in English
- **Rationale**: IMDb is an English-language platform
- **Impact**: Sentiment analysis optimized for English text

### 5. **Client-Side Requirements**
- **Assumption**: Users have modern browsers with JavaScript enabled
- **Rationale**: Next.js requires JavaScript for full functionality
- **Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 6. **Network Connectivity**
- **Assumption**: Stable internet connection for API calls and web scraping
- **Rationale**: App requires external data sources
- **Handling**: Loading states and error messages for network issues

### 7. **Sentiment Classification**
- **Assumption**: Ratings and review text correlate with sentiment
- **Logic**:
  - **Positive**: Rating ≥ 7.5/10 + favorable reviews
  - **Mixed**: Rating 5-7.5/10 or contradictory reviews
  - **Negative**: Rating < 5/10 + critical reviews
- **Confidence**: Calculated from review consistency, sample size, and sentiment clarity

### 8. **Review Sample Size**
- **Assumption**: First 15 reviews provide representative sample
- **Rationale**: First reviews are typically most helpful/popular
- **Analysis**: Gemini analyzes first 10 reviews for detailed sentiment

### 9. **User Input Format**
- **Assumption**: Users know or can find IMDb IDs (e.g., `tt0133093`)
- **Rationale**: IMDb IDs are visible in movie URLs
- **UX**: Examples provided, validation with clear error messages

### 10. **Mobile Usage**
- **Assumption**: Significant portion of users access on mobile devices
- **Design**: Mobile-first responsive design with touch-friendly controls
- **Testing**: Breakpoints tested on common device sizes

---

---

## 📁 Project Structure

```
movie-sentiment-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── movie/route.ts          # OMDb API integration
│   │   │   ├── reviews/route.ts        # IMDb review scraper
│   │   │   ├── sentiment/route.ts      # Gemini AI sentiment analysis
│   │   │   └── test-env/route.ts       # Environment variable checker
│   │   ├── globals.css                 # Global styles
│   │   ├── layout.tsx                  # Root layout
│   │   └── page.tsx                    # Main page component
│   ├── components/
│   │   ├── MovieSearch.tsx             # Search input with validation
│   │   ├── MovieDetails.tsx            # Movie info display
│   │   └── SentimentAnalysis.tsx       # Sentiment results display
│   ├── lib/
│   │   ├── scraper.ts                  # Review scraping logic
│   │   └── sentiment.ts                # AI + algorithmic analysis
│   └── types/
│       └── index.ts                    # TypeScript interfaces
├── .env.local                          # Environment variables (create this)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🎯 How It Works

### 1. **Movie Data Flow**
```
User Input (IMDb ID)
    ↓
[Validation] → Error if invalid format
    ↓
[OMDb API] → Fetch movie metadata
    ↓
Display: Title, Poster, Cast, Year, Ratings, Plot, etc.
```

### 2. **Review Scraping Flow**
```
IMDb ID
    ↓
[Construct IMDb Review URL]
    ↓
[Cheerio Web Scraper]
    ├─ Extract review text
    ├─ Extract ratings (x/10)
    ├─ Extract authors
    └─ Extract dates
    ↓
Return 15+ reviews
```

### 3. **Sentiment Analysis Flow**
```
Reviews Array
    ↓
[Google Gemini AI]
    ├─ Analyze first 10 reviews
    ├─ Generate summary
    ├─ Identify sentiment (positive/mixed/negative)
    ├─ Extract 4 key insights
    └─ Calculate confidence (60-95%)
    ↓
[Fallback: Algorithmic Analysis]
    ├─ If Gemini fails/unavailable
    ├─ Keyword matching
    └─ Statistical analysis
    ↓
Display: Summary, Classification, Insights, Confidence
```

## 📖 Usage Guide

### Basic Usage

1. **Open the app** at http://localhost:3000
2. **Enter IMDb ID** (format: `tt` followed by 7+ digits)
3. **Click "Analyze"** or press Enter
4. **View results**:
   - Movie details load first (~1-2 seconds)
   - Sentiment analysis follows (~5-8 seconds)

### Finding IMDb IDs

1. Go to [IMDb.com](https://www.imdb.com/)
2. Search for any movie
3. Look at URL: `https://www.imdb.com/title/tt0133093/`
4. Copy the ID: `tt0133093`

### Example Movies to Test

| IMDb ID | Movie | Expected Sentiment |
|---------|-------|-------------------|
| `tt0133093` | The Matrix | Positive (95%) |
| `tt0111161` | Shawshank Redemption | Positive (95%) |
| `tt0068646` | The Godfather | Positive (93%) |
| `tt0468569` | The Dark Knight | Positive (92%) |
| `tt0816692` | Interstellar | Positive (88%) |
| `tt2488496` | Star Wars: The Force Awakens | Mixed (70%) |
| `tt0365748` | The Room | Negative (50%) |

## 🎨 Features in Detail

### Responsive Design
- **Mobile**: Single-column layout, stacked components
- **Tablet**: Two-column grid for movie metadata
- **Desktop**: Side-by-side movie poster and details

### Animations
- Entry animations for all components
- Progress bar animation for confidence score
- Staggered insights reveal
- Smooth page transitions
- Loading spinner during analysis

### Error Handling
- Invalid IMDb ID format detection
- API failure graceful fallbacks
- Network error messages
- Loading timeout handling

### Validation
- IMDb ID regex pattern: `/^tt\d{7,}$/`
- Required field checking
- Real-time error feedback

## 🔧 Configuration

### Tailwind CSS
Custom colors defined in `tailwind.config.ts`:
```typescript
colors: {
  background: '#0a0e1a',
  card: '#0f1419',
  accent: '#06b6d4', // Cyan
}
```

### Next.js
Configuration in `next.config.ts`:
```typescript
images: {
  domains: ['m.media-amazon.com'], // IMDb poster images
}
```

## 🐛 Troubleshooting

### "Invalid IMDb ID format"
- Ensure format is `tt` + at least 7 digits
- Example: `tt0133093` ✅, `0133093` ❌

### "Failed to fetch movie data"
- Check OMDb API key in `.env.local`
- Verify IMDb ID exists on IMDb.com
- Check internet connection

### "Could not parse AI response"
- Gemini API may be rate limited (wait 1 minute)
- App will fall back to algorithmic analysis
- Check `GEMINI_API_KEY` in `.env.local`

### Reviews not loading
- IMDb may have changed HTML structure
- Check browser console for scraping errors
- Try a different movie

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import repository
4. Add environment variables:
   - `OMDB_API_KEY`
   - `GEMINI_API_KEY`
5. Deploy

### Environment Variables (Production)
Same as development:
```env
OMDB_API_KEY=your_key
GEMINI_API_KEY=your_key
```

## 📝 Development Notes

### Code Quality
- TypeScript strict mode enabled
- ESLint configuration included
- Responsive design tested on multiple devices

### Performance
- Next.js Image optimization for posters
- Code splitting by route
- Lazy loading for components
- Debounced search inputs

### Security
- API keys server-side only (never exposed to client)
- Input validation prevents injection
- CORS handled by Next.js
- Rate limiting recommended for production

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini AI](https://ai.google.dev/)
- [OMDb API Docs](http://www.omdbapi.com/)

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Google Gemini AI**

*Last Updated: March 2026*

