# DocuMind Web App

A comprehensive web application that automatically analyzes Business Requirements Documents (BRD) and extracts technical requirements, with a special focus on front-end development needs. DocuMind transforms complex business documents into actionable technical specifications, user stories, and development tasks.

## ✨ Features

### Core Functionality
- 📄 **Multi-format Support**: Upload PDF, Word (.doc, .docx), or Text (.txt) files
- 🤖 **AI-Powered Analysis**: Uses Groq API (LLaMA models) to intelligently extract requirements
- 🎯 **Comprehensive Extraction**: Automatically categorizes into:
  - Business Requirements Summary
  - Functional Requirements
  - Non-Functional Requirements
  - Front-End Requirements
  - Role-Based Requirements
  - User Stories with Acceptance Criteria
  - Actionable Task Breakdown
  - API Endpoints Specification
  - Use Case Flows
  - Business Rules
  - Contract States
  - Smart Recommendations

### Advanced Features
- 📊 **Visual Statistics Dashboard**: Interactive charts and graphs showing:
  - Requirements distribution by priority and type
  - Task breakdown by role
  - Visual comparison metrics
- 🔍 **Search & Filter**: Powerful search and filtering capabilities for:
  - Requirements by priority, role, and category
  - Tasks by role and priority
  - Real-time filtering across all data
- ⏱️ **Time & Cost Estimation**: 
  - Automatic hour estimation for tasks
  - Cost calculation with customizable hourly rates
  - Team size recommendations
  - Timeline projections (days/weeks/months)
- 📤 **Export to Project Management Tools**:
  - Export to Jira (CSV format)
  - Export to Trello (CSV format)
  - Export to Asana (CSV format)
  - Generic CSV and Markdown exports
- 🔄 **Analysis Comparison**: Compare multiple analyses side-by-side with:
  - Comparison tables
  - Visual charts
  - Detailed requirement comparison
  - Task breakdown comparison
- 🔗 **Share & Collaboration**: 
  - Generate shareable links for analyses
  - Public/private sharing options
  - Token-based access control
- 👥 **User Management**:
  - OAuth authentication (Google, GitHub, Apple)
  - Email/password authentication
  - User profiles and settings
  - Analysis history
- 📚 **Analysis History**: 
  - Save and access all previous analyses
  - Dashboard with analysis list
  - Quick access to past results
- 🌐 **Internationalization**: 
  - Multi-language support (i18n)
  - English and Arabic translations
- 💾 **Export Options**: 
  - Download as JSON
  - Download as PDF
  - Export to project management tools

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** (App Router) - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Shadcn/UI** - UI component library
- **Redux Toolkit** - State management
- **React i18next** - Internationalization
- **Recharts** - Data visualization
- **Formik + Yup** - Form handling and validation
- **React Dropzone** - File upload

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma ORM** - Database management
- **PostgreSQL** - Database (or any Prisma-supported database)
- **JWT (jose)** - Authentication tokens
- **bcryptjs** - Password hashing
- **OAuth4WebAPI** - OAuth implementation

### AI & Document Processing
- **Groq API** - AI-powered document analysis (LLaMA models)
- **PDF.js** - PDF parsing
- **Mammoth** - Word document parsing

### Architecture
- **Clean Architecture** - Backend organization (Domain, Application, Infrastructure layers)
- **Atomic Design Pattern** - Frontend component organization (Atoms, Molecules, Organisms, Templates, Pages)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (or any Prisma-supported database)
- Groq API key (for AI analysis)
- OAuth credentials (optional, for OAuth login):
  - Google OAuth Client ID & Secret
  - GitHub OAuth Client ID & Secret
  - Apple OAuth Client ID & Secret

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd "DocuMind Web App"
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

4. **Edit `.env.local` and configure:**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/documind?schema=public"

# Groq API (for AI analysis)
GROQ_API_KEY=your_groq_api_key_here

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Set up the database:**
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

6. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

7. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 📖 Usage

### Basic Workflow

1. **Sign Up / Login**: Create an account or sign in with OAuth
2. **Upload a BRD**: Click or drag & drop your BRD file (PDF, DOC, DOCX, or TXT)
3. **Wait for Analysis**: The system will parse the document and analyze it with AI
4. **Review Results**: Browse through the categorized requirements in organized sections:
   - Overview with summary statistics
   - Analytics & Insights with charts
   - Requirements (Functional, Non-Functional, Frontend, Role-based)
   - Features & Business Rules
   - Development (User Stories, Tasks, API Endpoints, Use Cases)
   - Recommendations
   - Export & Integration
5. **Use Advanced Features**:
   - Filter by role, priority, or category
   - Search across all requirements
   - View statistics and charts
   - Estimate time and cost
   - Compare multiple analyses
   - Share analyses with team members
   - Export to project management tools
6. **Export**: Download the results as JSON, PDF, or export to Jira/Trello/Asana

### Dashboard Features

- **Analysis History**: View all your previous analyses
- **Quick Actions**: Access recent analyses, create new ones
- **Statistics**: Overview of your analysis activity

## 📁 Project Structure

```
DocuMind Web App/
│
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Marketing routes
│   ├── analyze/                  # Analysis page
│   ├── api/                      # API Routes
│   │   ├── analyses/             # Analysis endpoints
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/            # Login endpoint
│   │   │   ├── signup/           # Signup endpoint
│   │   │   ├── logout/           # Logout endpoint
│   │   │   ├── me/               # Current user endpoint
│   │   │   └── oauth/            # OAuth endpoints
│   │   └── shared/               # Shared analysis endpoints
│   ├── dashboard/                # Dashboard page
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── checkout/                # Checkout page
│   ├── shared/                  # Shared analysis pages
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React Components (Atomic Design)
│   ├── atoms/                    # Atomic Components
│   │   ├── Icon.tsx
│   │   ├── Label.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Spinner.tsx
│   │   └── FileIcon.tsx
│   │
│   ├── molecules/                # Molecular Components
│   │   ├── FormField.tsx
│   │   ├── FileCard.tsx
│   │   ├── Dropzone.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── StatisticsCard.tsx
│   │   └── SearchFilter.tsx
│   │
│   ├── organisms/                # Organism Components
│   │   ├── AppHeader.tsx
│   │   ├── StatisticsDashboard.tsx
│   │   ├── TimeCostEstimator.tsx
│   │   ├── ExportToTools.tsx
│   │   ├── AnalysisComparison.tsx
│   │   ├── ShareAnalysis.tsx
│   │   └── ResultsDisplay.tsx
│   │
│   ├── templates/               # Template Components
│   │   └── AuthLayout.tsx
│   │
│   ├── pages/                    # Page Components
│   │   └── LoginPage.tsx
│   │
│   └── ui/                       # Shadcn UI components
│
├── lib/                         # Library Code
│   ├── domain/                   # Domain Layer (Clean Architecture)
│   │   ├── entities/             # Domain entities
│   │   └── interfaces/          # Repository interfaces
│   │
│   ├── application/              # Application Layer
│   │   └── use-cases/            # Business logic
│   │
│   ├── infrastructure/           # Infrastructure Layer
│   │   ├── repositories/         # Data access
│   │   ├── oauth/                # OAuth implementation
│   │   └── services/             # External services
│   │
│   ├── types.ts                  # TypeScript interfaces
│   ├── utils.ts                  # Utility functions
│   ├── document-parser.ts        # Document parsing logic
│   ├── frontend-llm.ts          # Groq API integration
│   ├── pdf-generator.ts         # PDF export functionality
│   ├── db.ts                    # Prisma client
│   ├── hooks.ts                 # Redux hooks
│   └── store/                   # Redux store
│       ├── authSlice.ts
│       └── uiSlice.ts
│
├── prisma/                      # Prisma ORM
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── public/                      # Static files
│   ├── locales/                 # Translation files
│   │   ├── en/
│   │   └── ar/
│   └── sample-brd.txt           # Sample BRD for testing
│
└── README.md                    # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/oauth/[provider]` - OAuth initiation (Google, GitHub, Apple)
- `GET /api/auth/oauth/[provider]/callback` - OAuth callback

### Analysis

- `POST /api/analyses` - Create new analysis
- `GET /api/analyses` - Get user's analyses
- `GET /api/analyses/[id]` - Get specific analysis
- `DELETE /api/analyses/[id]` - Delete analysis
- `POST /api/analyses/[id]/share` - Create share link
- `GET /api/shared/[token]` - Get shared analysis

### Analysis Response Format

```json
{
  "businessRequirementsSummary": "...",
  "functionalRequirements": [...],
  "nonFunctionalRequirements": [...],
  "frontendRequirements": [...],
  "roleRequirements": [...],
  "userStories": [...],
  "taskBreakdown": [...],
  "apiEndpoints": [...],
  "useCaseFlows": [...],
  "businessRules": [...],
  "contractStates": [...],
  "features": [...],
  "recommendations": [...],
  "metadata": {
    "totalRequirements": 0,
    "processedAt": "2024-01-01T00:00:00Z"
  }
}
```

## 🗄️ Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts and authentication
- **Analysis**: Saved analysis results
- **Account**: OAuth account connections
- **Session**: User sessions
- **ShareLink**: Shareable analysis links

See `prisma/schema.prisma` for the complete schema.

## ⚙️ Configuration

### Groq API

The application uses Groq API for AI-powered analysis. You can configure the model in the code (currently using LLaMA models).

### Database

Supports any database that Prisma supports:
- PostgreSQL (recommended)
- MySQL
- SQLite
- SQL Server
- MongoDB

### OAuth Setup

See `OAUTH_SETUP.md` for detailed OAuth configuration instructions.

### Internationalization

Translation files are located in `public/locales/`. Currently supports:
- English (`en`)
- Arabic (`ar`)

To add a new language, create a new folder in `public/locales/` with translation files.

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Make sure to set all required environment variables in your production environment:
- `DATABASE_URL`
- `GROQ_API_KEY`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- OAuth credentials (if using OAuth)

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

## 🐛 Troubleshooting

### "DATABASE_URL is not configured"
- Make sure you've created `.env.local` with your database URL
- Ensure your database is running and accessible
- Run `npx prisma migrate dev` to set up the database schema

### "GROQ_API_KEY is not configured"
- Add your Groq API key to `.env.local`
- Restart the development server after adding the key

### "Failed to parse document"
- Ensure the file is a valid PDF, Word document, or text file
- Check that the file isn't corrupted
- Try converting the document to a different format

### Analysis takes too long
- Large documents may take several minutes
- Check your Groq API rate limits
- Ensure your internet connection is stable

### OAuth not working
- Verify OAuth credentials in `.env.local`
- Check redirect URIs in OAuth provider settings
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly

## 📝 Sample BRD

A sample BRD file (`sample-brd.txt`) is included in the `public` folder for testing purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Follow the Atomic Design pattern for components
- Use Clean Architecture principles for backend code
- Write TypeScript with proper types
- Follow the existing code style
- Add tests for new features

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- AI powered by [Groq](https://groq.com/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support

For issues and questions, please open an issue on the repository.

---

Made with ❤️ for developers and product managers
