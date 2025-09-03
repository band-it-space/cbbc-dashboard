# CBBC Dashboard

A comprehensive dashboard for monitoring and analyzing CBBC (Callable Bull/Bear Certificates) data with real-time updates, filtering capabilities, and detailed analytics.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/band-it-space/cbbc-dashboard.git
   cd cbbc-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```bash
   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here

   # Backend API Configuration
   BACKEND_API_URL=http://52.195.141.129:8000
   CBBC_API_BASE=/metrics/cbbc
   KO_API_BASE=/metrics/ko
   UNDERLYINGS_API_BASE=/metrics/underlyings

   # Environment
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
cbbc-dashboard/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (dashboard)/              # Dashboard route group
│   │   │   ├── dashboard/            # Main dashboard page
│   │   │   │   ├── [code]/          # Dynamic CBBC code page
│   │   │   │   └── page.tsx         # Dashboard home
│   │   │   ├── ko-codes/            # Knock-out codes page
│   │   │   └── layout.tsx           # Dashboard layout
│   │   ├── api/                      # API routes (CORS proxy)
│   │   │   ├── cbbc/                # CBBC data endpoints
│   │   │   │   ├── aggregate/       # Aggregated CBBC data
│   │   │   │   ├── single-date/     # Single date CBBC data
│   │   │   │   └── underlyings/     # Underlying assets
│   │   │   ├── ko/                  # Knock-out data
│   │   │   └── telegram/            # Telegram notifications
│   │   │       └── notify/          # Error notification endpoint
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/                   # React components
│   │   ├── CBBCTable/               # CBBC matrix table components
│   │   │   ├── CBBCMatrixRow.tsx    # Table row component
│   │   │   ├── CBBCMidSummary.tsx   # Summary component
│   │   │   ├── GroupedCBBCMetricsMatrix.tsx # Main table
│   │   │   ├── MatrixHeader.tsx     # Table header
│   │   │   ├── NotionalLegend.tsx   # Color legend
│   │   │   └── types.ts             # Table types
│   │   ├── dashboard/               # Dashboard-specific components
│   │   │   ├── DashboardContent.tsx # Main content component
│   │   │   ├── EmptyState.tsx       # Empty state component
│   │   │   └── LoadingState.tsx     # Loading state component
│   │   ├── ErrorBoundary.tsx        # Error boundary component
│   │   ├── FiltersPanel.tsx         # Date and filter controls
│   │   ├── Header.tsx               # App header
│   │   ├── IssuerSelect.tsx         # Issuer selection
│   │   ├── KOFiltersPanel.tsx       # KO-specific filters
│   │   ├── KOTableSkeleton.tsx      # KO table skeleton
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   ├── SingleDateCBBCTable.tsx  # Single date table
│   │   ├── SmartKOTable.tsx         # Enhanced KO table
│   │   ├── SmartSingleDateCBBCTable.tsx # Enhanced single date table
│   │   └── TabsPanel.tsx            # Tab navigation
│   ├── hooks/                       # Custom React hooks
│   │   ├── useCBBCMatrixData.ts     # CBBC matrix data processing
│   │   ├── useCBBCQuery.ts          # CBBC data fetching
│   │   ├── useDashboardData.ts      # Dashboard data management
│   │   ├── useDashboardFilters.ts   # Filter management
│   │   ├── useErrorNotification.ts  # Telegram notifications
│   │   ├── useGroupedCBBCQuery.ts   # Grouped CBBC queries
│   │   ├── useKOQuery.ts            # Knock-out queries
│   │   ├── useSingleDateCBBCQuery.ts # Single date queries
│   │   └── useUnderlyingsQuery.ts   # Underlying assets queries
│   ├── lib/                         # Utility libraries
│   │   ├── api.ts                   # API utilities
│   │   ├── config.ts                # Environment configuration
│   │   ├── dateUtils.ts             # Date manipulation utilities
│   │   ├── format.ts                # Formatting utilities
│   │   └── utils.ts                 # General utilities
│   └── store/                       # State management (Zustand)
│       ├── groupedCBBCStore.ts      # CBBC data store
│       ├── groupedCBBCTypes.ts      # CBBC type definitions
│       └── types.ts                 # General types
├── public/                          # Static assets
├── env.example                      # Environment variables template
├── package.json                     # Dependencies and scripts
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── next.config.ts                   # Next.js configuration
```

## 🏗️ Architecture Overview

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **React Query (TanStack Query)** - Server state management
- **Material-UI** - UI components for date picker

### Backend Integration
- **CORS Proxy** - Next.js API routes act as proxy to external backend
- **HTTP Backend** - External API at `http://52.195.141.129:8000`
- **Real-time Data** - Live CBBC and KO data updates

### Key Features
- 📊 **CBBC Matrix Table** - Comprehensive view of CBBC data by ranges and dates
- 🔍 **Advanced Filtering** - Filter by date, underlying, issuer, and range
- 📈 **Single Date View** - Detailed view for specific dates
- 🚨 **Error Monitoring** - Telegram notifications for system errors
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Real-time Updates** - Live data refresh capabilities

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Development with Turbopack (faster)
npm run dev --turbopack
```

### Code Style

- **ESLint** - Code linting with Next.js config
- **TypeScript** - Strict type checking
- **Prettier** - Code formatting (via ESLint)

### State Management

The app uses **Zustand** for global state management:

```typescript
// Store structure
interface GroupedCBBCStore {
  // Data
  groupedRawData: GroupedBackendCBBC[]
  underlyings: Underlying[]
  
  // Filters
  filters: Filters
  date: string | null
  
  // Actions
  setFilters: (filters: Filters) => void
  setDate: (date: string | null) => void
  // ... more actions
}
```

### Data Flow

1. **API Routes** (`/api/*`) - Proxy requests to backend
2. **React Query Hooks** - Fetch and cache data
3. **Zustand Store** - Global state management
4. **Components** - Display data with real-time updates

## 📊 Data Models

### CBBC Data Structure

```typescript
interface GroupedBackendCBBC {
  date: string
  range: string
  count: number
  outstanding_quantity: number
  calculated_notional: number
  shares: number
  cbcc_list: GroupedCBBCEntry[]
  total_processed: number
}

interface GroupedCBBCEntry {
  code: string
  call_level: number
  quantity: number
  notional: number
  shares_number: number
  ul_price: number
  issuer: string
  bull_bear: "Bull" | "Bear"
  date: string
  os_percent: number
  last_price: number
  divisor: number
  type: "stock" | "index"
}
```

### Underlying Assets

```typescript
interface Underlying {
  code: string
  name: string
  type: "stock" | "index"
  ranges: number[]
}
```

## 🔌 API Integration

### Backend Endpoints

The app proxies requests to the external backend:

- **CBBC Aggregate**: `/metrics/cbbc/aggregate`
- **CBBC Single Date**: `/metrics/cbbc/single-date`
- **KO Data**: `/metrics/ko`
- **Underlyings**: `/metrics/underlyings`

### CORS Proxy Implementation

```typescript
// Example: /api/cbbc/aggregate/route.ts
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.toString();
  
  const res = await fetch(
    `${config.backend.baseUrl}${config.backend.endpoints.cbbc}/aggregate?${query}`
  );
  
  if (!res.ok) {
    return new Response("Failed to fetch data", { status: res.status });
  }
  
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
```

## 🚨 Error Monitoring

### Telegram Integration

The app includes comprehensive error monitoring via Telegram:

```typescript
// Error notification hook
const { sendErrorNotification } = useErrorNotification();

// Usage
sendErrorNotification(
  "/api/cbbc/single-date",
  error.message,
  "Single date CBBC query failed"
);
```

### Error Boundary

React Error Boundary catches client-side errors:

```typescript
<ErrorBoundary>
  <DashboardContent />
</ErrorBoundary>
```

## 🎨 UI Components

### CBBC Matrix Table

The main feature is the CBBC matrix table showing:

- **Call Ranges** - Bull/Bear ranges with current price reference
- **Notional Values** - HKD and USD amounts with color coding
- **Quantity** - Outstanding quantities
- **Equivalent** - Shares/futures equivalents
- **Codes** - CBBC contract codes
- **Historical Data** - Previous dates comparison

### Date Picker

Enhanced date picker with weekend restrictions:

```typescript
<DatePicker
  value={date}
  onChange={setDate}
  label="Date"
  disabled={isFetching}
/>
```

## 🧪 Testing

### Manual Testing

1. **Date Selection** - Test weekend restrictions
2. **Filtering** - Test issuer and underlying filters
3. **Data Loading** - Test loading states and error handling
4. **Responsive Design** - Test on different screen sizes

### Error Scenarios

- Backend unavailable
- Network timeouts
- Invalid date ranges
- Empty data responses

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository** - Link GitHub repo to Vercel
2. **Set Environment Variables** - Add all required env vars
3. **Deploy** - Automatic deployment on push to main

### Environment Variables

Required for production:

```bash
TELEGRAM_BOT_TOKEN=your_production_bot_token
TELEGRAM_CHAT_ID=your_production_chat_id
BACKEND_API_URL=your_production_backend_url
NODE_ENV=production
```

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes** - Follow existing code patterns

3. **Test Changes** - Ensure all functionality works

4. **Create Pull Request** - Detailed description of changes

### Code Guidelines

- Use TypeScript for all new code
- Follow existing component patterns
- Add proper error handling
- Update documentation for new features
- Test on multiple screen sizes

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Material-UI Documentation](https://mui.com/)

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors** - Check TypeScript types and imports
2. **API Errors** - Verify backend connectivity and CORS
3. **Date Issues** - Check date format and timezone handling
4. **State Issues** - Verify Zustand store updates

### Debug Mode

Enable debug logging:

```typescript
// In development
console.log("Debug info:", data);
```

## 📞 Support

For questions or issues:

1. Check existing issues in GitHub
2. Create new issue with detailed description
3. Include error logs and reproduction steps

---

**Happy Coding! 🚀**