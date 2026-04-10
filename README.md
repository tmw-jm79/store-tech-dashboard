# Store Tech Operations Dashboard

A React-based operations dashboard for monitoring store technology across multiple retail brands. Built with TypeScript, Vite, Tailwind CSS, Recharts, and Leaflet.

## Overview

This dashboard provides real-time visibility into technology operations across 1,018 retail store locations spanning 4 brands:
- **TMW** - Men's Wearhouse (651 stores)
- **JAB** - JoS. A. Bank (182 stores)
- **MSP** - Moores (108 stores)
- **KNG** - K&G Superstore (81 stores)

## Features

### Dashboard Views

1. **Overview** - High-level summary of all stores, POS/network status, device health, and active incidents
2. **POS Systems** - Point-of-sale system status monitoring with store-level details
3. **Network Health** - Network connectivity, switches, VoIP phone status, and regional health chart
4. **Device Inventory** - 14 device categories tracked across all stores
5. **Incidents** - Open incidents with pagination, categorized by type with priority and status
6. **All Stores** - Complete store listing with search and pagination
7. **Store Map** - Interactive map showing all store locations with status indicators
8. **Store Detail** - Comprehensive single-store view with all systems, devices, and incidents

### Global Search

Search bar in the header allows quick access to:
- **Stores** - Search by ID, name, city, or state
- **Incidents** - Search by incident ID or summary
- Results navigate directly to the Store Detail page
- Keyboard navigation support (arrow keys, Enter, Escape)

### Hierarchical Filtering

All views (except Overview) support cascading filters:
- **Brand** → **Zone** → **Region** → **District** → **Store**

Each filter level can be individually cleared using the X button, which resets that level and all levels below it.

### Interactive Store Map

- Color-coded markers: Green (healthy), Yellow (warning), Red (critical)
- Click markers to view store details in popup
- "View Details" button navigates to Store Detail page
- Auto-zoom to fit filtered stores
- Switches between dark/light map tiles based on theme

### Store Detail Page

Comprehensive view of a single store including:
- Store header with ID, name, location, and overall health status
- Manager information (name and short name)
- Hierarchy breadcrumb (Zone → Region → District)
- POS and Network system status
- Complete device inventory with online/offline counts
- Open incidents table for that store
- Location coordinates

Access via:
- Clicking a row in All Stores table
- Clicking "View Details" in map popup
- Selecting a search result

### Collapsible Sidebar

- Toggle button to collapse/expand navigation
- Collapsed state shows icons with tooltips
- Smooth transition animation
- Incident count badge (dot when collapsed)

### Dark/Light Mode

- Toggle in header (sun/moon icon)
- Full theme support across all views
- Map tiles switch between dark and light styles
- Default: Dark mode

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
- **Leaflet / React-Leaflet** - Interactive maps
- **Lucide React** - Icons

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── FilterBar.tsx     # Hierarchical filter dropdowns
│   ├── GlobalSearch.tsx  # Header search component
│   ├── Header.tsx        # Dashboard header with search, theme toggle
│   ├── Sidebar.tsx       # Collapsible navigation sidebar
│   ├── StatCard.tsx      # Metric display cards
│   └── StatusBadge.tsx   # Status indicator badges
├── data/
│   ├── coordinates.ts    # City coordinates database (1,600+ cities)
│   ├── stores.json       # Store data (1,018 locations)
│   ├── storeService.ts   # Data service layer
│   └── types.ts          # TypeScript interfaces
├── views/                # Dashboard views
│   ├── DevicesView.tsx   # Device inventory
│   ├── IncidentsView.tsx # Open incidents with pagination
│   ├── MapView.tsx       # Interactive store map
│   ├── NetworkView.tsx   # Network health
│   ├── OverviewView.tsx  # Main dashboard
│   ├── POSView.tsx       # POS systems
│   ├── StoreDetailView.tsx # Single store detail
│   └── StoresView.tsx    # Store listing with pagination
├── App.tsx               # Main application
├── main.tsx              # Entry point
└── index.css             # Global styles

scripts/
├── csvToJson.js          # Convert CSV to JSON
└── processUpdatedStores.js # Process store data with coordinates

public/
├── favicon.svg           # Store icon favicon
└── logo.png              # Company logo
```

## Data Layer

### Store Data (`stores.json`)

Store data with fields:
- `id` - Store identifier (e.g., TMW_1234)
- `name` - Store name
- `brand` - Brand code (TMW, JAB, MSP, KNG)
- `zone` - Geographic zone
- `region` - Region within zone
- `district` - District within region
- `storeType` - Store type (e.g., "Brick & Mortar")
- `storeStatus` - Operational status (e.g., "Open")
- `managerShortName` - Manager short identifier
- `managerName` - Manager full name
- `city`, `state` - Location
- `latitude`, `longitude` - Geographic coordinates

### Coordinates Database (`coordinates.ts`)

Contains coordinates for 1,600+ US and Canadian cities for mapping stores.

### Generated Data (`storeService.ts`)

The service layer generates simulated operational data:
- **Device counts** - Based on fleet averages per brand from Hardware Refresh Strategy
- **Online/offline status** - ~90% online for networked devices
- **Incidents** - 40-120 random incidents with realistic summaries

### Updating Store Data

To update the store listing:

1. Prepare a pipe-delimited CSV with columns:
   ```
   STORECODE|STORENAME|BRAND|ZONE|REGION|DISTRICT|STORETYPE|STORESTATUS|MGRSNAME|MGRNAME|CITY|STATE|LATITUDE|LONGITUDE
   ```

2. Place the file in `scripts/` folder

3. Run the processing script:
   ```bash
   node scripts/processUpdatedStores.js > src/data/stores.json
   ```

The script will fill in missing coordinates from the city database.

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

## Deployment

### Docker (for Cloud Run)

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### GCP Deployment Options

1. **Firebase Hosting** - Simple static hosting
2. **Cloud Run** - Containerized, scales to zero
3. **Cloud Storage + CDN** - Static file hosting

## Production Architecture (Planned)

### Data Integration

For real-time data integration with device management systems:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Intune    │    │ MobileIron  │    │   Ivanti    │
│  (Graph API)│    │    (API)    │    │  (BI/SQL)   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────┐
│   Cloud Functions / Cloud Run Jobs                  │
│   - Polls APIs every 1-5 min                        │
│   - Syncs Ivanti incidents every 5-15 min           │
│   - Normalizes & maps to stores                     │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│   Firestore or Cloud SQL                            │
│   - Device status storage                           │
│   - Incident data                                   │
│   - Store/brand mapping                             │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│   Cloud Run (API Service)                           │
│   GET /api/devices/status                           │
│   GET /api/devices/by-store                         │
│   GET /api/incidents                                │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│   React Dashboard                                   │
│   - Firebase Hosting / Cloud Run                    │
│   - Polls API every 30-60 sec                       │
└─────────────────────────────────────────────────────┘
```

### Ivanti Integration (BI Reporting Server)

For incident data from Ivanti:
- Connect to BI Reporting SQL Server database
- Query incident tables on a scheduled basis (every 5-15 min)
- Map store IDs to dashboard store data
- Sync open incidents to cloud database

Required fields:
- Incident Number
- Summary/Subject
- Status
- Priority
- Category
- Store/Location ID
- Created Date
- Last Updated

### GCP Services

| Component | Service | Purpose |
|-----------|---------|---------|
| Data Ingestion | Cloud Functions | Poll Intune/MobileIron APIs |
| Incident Sync | Cloud Run Jobs | Sync from Ivanti BI database |
| Scheduler | Cloud Scheduler | Trigger sync jobs |
| Database | Firestore/Cloud SQL | Store device status & incidents |
| API | Cloud Run | Serve data to dashboard |
| Hosting | Firebase Hosting | Host React app |
| Caching | Memorystore (Redis) | Optional fast reads |

## License

Proprietary - Internal use only.
