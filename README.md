# Store Tech Operations Dashboard

A React-based operations dashboard for monitoring store technology across multiple retail brands. Built with TypeScript, Vite, Tailwind CSS, and Recharts.

## Overview

This dashboard provides real-time visibility into technology operations across 1,000+ retail store locations spanning 4 brands:
- **TMW** - Men's Wearhouse (651 stores)
- **JAB** - JoS. A. Bank (182 stores)
- **MSP** - Moores (108 stores)
- **KNG** - K&G Superstore (81 stores)

## Features

### Dashboard Views

1. **Overview** - High-level summary of all stores, POS/network status, device health, and active incidents
2. **POS Systems** - Point-of-sale system status monitoring with store-level details
3. **Network Health** - Network connectivity, switches, and VoIP phone status
4. **Device Inventory** - 14 device categories tracked across all stores
5. **Incidents** - Open incidents categorized by type with priority and status
6. **All Stores** - Complete store listing with search and pagination

### Hierarchical Filtering

All views (except Overview) support cascading filters:
- **Brand** → **Zone** → **Region** → **District** → **Store**

Each filter level can be individually cleared using the X button, which resets that level and all levels below it.

### Device Categories

**Networked Devices (Online/Offline Status):**
- POS Computers
- iPads
- Pin Pads
- Receipt Printers
- Laser Printers
- Chromebooks
- Desktop Phones
- Cordless Phones
- Network Switches

**Passive Devices (Count Only):**
- Avery Markdown Scanners
- Tailoring Printers
- Barcode Scanners
- Cash Drawers
- Monitors

### Incident Categories

- Accounts and Access
- Application
- Hardware
- Miscellaneous
- Network
- Security
- Software

Each incident has a priority (Critical, High, Medium, Low) and status (New, In Progress, Pending, On Hold).

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **Recharts** - Charts and visualizations
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FilterBar.tsx    # Hierarchical filter dropdowns
│   ├── Header.tsx       # Dashboard header with refresh
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── StatCard.tsx     # Metric display cards
│   └── StatusBadge.tsx  # Status indicator badges
├── data/
│   ├── stores.json      # Store data (1,022 locations)
│   ├── storeService.ts  # Data service layer
│   └── types.ts         # TypeScript interfaces
├── views/               # Dashboard views
│   ├── DevicesView.tsx  # Device inventory
│   ├── IncidentsView.tsx# Open incidents
│   ├── NetworkView.tsx  # Network health
│   ├── OverviewView.tsx # Main dashboard
│   ├── POSView.tsx      # POS systems
│   └── StoresView.tsx   # Store listing
├── App.tsx              # Main application
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Data Layer

### Store Data (`stores.json`)
Raw store data with fields:
- `id` - Store identifier
- `name` - Store name
- `brand` - Brand code (TMW, JAB, MSP, KNG)
- `zone` - Geographic zone
- `region` - Region within zone
- `district` - District within region
- `city`, `state` - Location

### Generated Data (`storeService.ts`)
The service layer generates simulated operational data:
- **Device counts** - Based on fleet averages per brand from Hardware Refresh Strategy
- **Online/offline status** - ~90% online for networked devices
- **Incidents** - 40-120 random incidents with realistic summaries

### Updating Store Data
To update the store listing:
1. Export new CSV with columns: Store ID, Store Name, Brand, Zone, Region, District, City, State
2. Run the conversion script:
   ```bash
   node scripts/csvToJson.js < new_stores.csv > src/data/stores.json
   ```

## Development

### Prerequisites
- Node.js 20.x or higher
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Scripts
- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Production Architecture (Planned)

For real-time data integration with Intune and MobileIron on Google Cloud Platform:

```
┌─────────────┐    ┌─────────────┐
│   Intune    │    │ MobileIron  │
│  (Graph API)│    │    (API)    │
└──────┬──────┘    └──────┬──────┘
       │                  │
       ▼                  ▼
┌─────────────────────────────────┐
│   Cloud Functions (Node.js)     │
│   - Polls APIs every 1-5 min    │
│   - Normalizes & maps to stores │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│   Firestore or Cloud SQL        │
│   - Device status storage       │
│   - Store/brand mapping         │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│   Cloud Run (API Service)       │
│   GET /api/devices/status       │
│   GET /api/devices/by-store     │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│   React Dashboard               │
│   - Firebase Hosting            │
│   - Polls API every 30-60 sec   │
└─────────────────────────────────┘
```

### GCP Services
| Component | Service | Purpose |
|-----------|---------|---------|
| Data Ingestion | Cloud Functions | Poll Intune/MobileIron APIs |
| Scheduler | Cloud Scheduler | Trigger functions every 1-5 min |
| Database | Firestore/Cloud SQL | Store device status & mappings |
| API | Cloud Run | Serve data to dashboard |
| Hosting | Firebase Hosting | Host React app |
| Caching | Memorystore (Redis) | Optional fast reads |

## License

Proprietary - Internal use only.
