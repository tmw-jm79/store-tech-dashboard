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
│   Cloud Run Jobs                                    │
│   - Polls Intune/MobileIron APIs every 1-5 min      │
│   - Syncs Ivanti incidents every 5-15 min           │
│   - Normalizes & maps to stores                     │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│   Cloud SQL (PostgreSQL)                            │
│   - stores: Store master data                       │
│   - devices: Device status & inventory              │
│   - incidents: Open/historical incidents            │
│   - device_status_history: Time-series data         │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│   Cloud Run (API Service)                           │
│   GET /api/stores                                   │
│   GET /api/stores/:id                               │
│   GET /api/devices/status                           │
│   GET /api/devices/by-store/:storeId                │
│   GET /api/incidents                                │
│   GET /api/incidents/by-store/:storeId              │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│   React Dashboard (Cloud Run)                       │
│   - Polls API every 30-60 sec                       │
│   - WebSocket for real-time updates (future)        │
└─────────────────────────────────────────────────────┘
```

### Cloud SQL Schema

```sql
-- Stores table
CREATE TABLE stores (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(10) NOT NULL,
    zone VARCHAR(20),
    region VARCHAR(20),
    district VARCHAR(20),
    store_type VARCHAR(50),
    store_status VARCHAR(20),
    manager_short_name VARCHAR(20),
    manager_name VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(10),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices table
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    store_id VARCHAR(20) REFERENCES stores(id),
    device_type VARCHAR(50) NOT NULL,
    device_name VARCHAR(100),
    serial_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'unknown',
    last_seen TIMESTAMP,
    source VARCHAR(20), -- 'intune', 'mobileiron'
    source_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incidents table
CREATE TABLE incidents (
    id VARCHAR(20) PRIMARY KEY,
    store_id VARCHAR(20) REFERENCES stores(id),
    summary TEXT,
    category VARCHAR(50),
    priority VARCHAR(20),
    status VARCHAR(30),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    resolved_at TIMESTAMP,
    source VARCHAR(20) DEFAULT 'ivanti',
    source_id VARCHAR(100)
);

-- Device status history (for trends)
CREATE TABLE device_status_history (
    id SERIAL PRIMARY KEY,
    store_id VARCHAR(20) REFERENCES stores(id),
    device_type VARCHAR(50),
    total_count INT,
    online_count INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_devices_store_id ON devices(store_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_incidents_store_id ON incidents(store_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_device_history_store_date ON device_status_history(store_id, recorded_at);
```

### Ivanti Integration (BI Reporting Server)

For incident data from Ivanti:
- Connect to BI Reporting SQL Server database via Cloud SQL Proxy or VPN
- Query incident tables on a scheduled basis (every 5-15 min)
- Map store IDs to dashboard store data
- Sync open incidents to Cloud SQL

Required fields from Ivanti:
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
| Database | Cloud SQL (PostgreSQL) | Primary data store for stores, devices, incidents |
| Data Sync | Cloud Run Jobs | Poll Intune/MobileIron/Ivanti on schedule |
| Scheduler | Cloud Scheduler | Trigger sync jobs every 1-15 min |
| API | Cloud Run | REST API serving dashboard |
| Dashboard | Cloud Run | Host React application |
| Secrets | Secret Manager | Store API keys and DB credentials |
| Networking | VPC / Cloud SQL Proxy | Secure connection to Ivanti BI server |
| Monitoring | Cloud Monitoring | Alerts and dashboards for system health |
| Logging | Cloud Logging | Centralized logs for debugging |

### Environment Configuration

```bash
# Cloud SQL connection
DB_HOST=/cloudsql/project:region:instance
DB_NAME=store_tech_ops
DB_USER=api_service
DB_PASSWORD=<from Secret Manager>

# Intune API
INTUNE_TENANT_ID=<tenant-id>
INTUNE_CLIENT_ID=<client-id>
INTUNE_CLIENT_SECRET=<from Secret Manager>

# MobileIron API
MOBILEIRON_URL=https://mobileiron.company.com/api
MOBILEIRON_API_KEY=<from Secret Manager>

# Ivanti BI Server
IVANTI_DB_HOST=ivanti-bi-server.company.com
IVANTI_DB_NAME=ServiceManager
IVANTI_DB_USER=readonly_user
IVANTI_DB_PASSWORD=<from Secret Manager>

# Okta SSO
OKTA_ISSUER=https://<your-domain>.okta.com/oauth2/default
OKTA_CLIENT_ID=<client-id>
OKTA_CLIENT_SECRET=<from Secret Manager>
OKTA_AUDIENCE=api://store-tech-ops
```

## Access Control

### Overview

- **Authentication:** Okta SSO (OIDC)
- **Authorization:** Azure AD group membership
- **Access Model:** All authenticated users with group membership get full access

### Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────▶│    Okta     │────▶│  Azure AD   │
│  (Browser)  │     │    SSO      │     │   (Groups)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ ID Token    │
                    │ + Groups    │
                    └──────┬──────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│   Cloud Run (API)                                   │
│   - Validates Okta JWT token                        │
│   - Checks group claim for authorization            │
│   - Returns 401 if not authenticated                │
│   - Returns 403 if not in authorized group          │
└─────────────────────────────────────────────────────┘
```

### How It Works

1. User navigates to dashboard
2. If not authenticated, redirected to Okta login
3. User authenticates with Okta (which federates to Azure AD)
4. Okta issues ID token with group claims
5. Dashboard sends token with API requests
6. API validates token and checks group membership
7. If user is in authorized AD group → Access granted
8. If not → 403 Forbidden

### Azure AD Configuration

1. **Create Security Group:**
   - Name: `SG-StoreTechOps-Users`
   - Type: Security
   - Add authorized users as members

2. **Sync to Okta:**
   - Ensure AD → Okta sync includes group membership
   - Or manually create matching group in Okta

### Okta Configuration

1. **Create OIDC Application:**
   - Application type: Web Application
   - Sign-in redirect URI: `https://store-tech-ops.company.com/callback`
   - Sign-out redirect URI: `https://store-tech-ops.company.com`
   - Grant types: Authorization Code
   - Assignments: Assign to the authorized group

2. **Configure Groups Claim:**
   - Go to Security → API → Authorization Servers
   - Select your authorization server (or "default")
   - Add a claim:
     - Name: `groups`
     - Include in: ID Token, Access Token
     - Value type: Groups
     - Filter: Matches regex `.*` (or specific group pattern)

3. **Application Credentials:**
   - Note the Client ID
   - Generate a Client Secret
   - Store in GCP Secret Manager

### API Token Validation

The API service validates incoming requests:

```javascript
// Middleware pseudocode
async function authenticate(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Verify token with Okta
    const decoded = await oktaJwtVerifier.verifyAccessToken(token, OKTA_AUDIENCE);
    
    // Check group membership
    const groups = decoded.claims.groups || [];
    const authorizedGroup = 'SG-StoreTechOps-Users';
    
    if (!groups.includes(authorizedGroup)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    req.user = decoded.claims;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### React Frontend Integration

Install Okta SDK:
```bash
npm install @okta/okta-react @okta/okta-auth-js
```

Configure in the app:
```typescript
// src/config/okta.ts
export const oktaConfig = {
  issuer: import.meta.env.VITE_OKTA_ISSUER,
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
  redirectUri: `${window.location.origin}/callback`,
  scopes: ['openid', 'profile', 'email', 'groups'],
};
```

Wrap the app with Okta provider:
```typescript
// src/main.tsx
import { Security } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';

const oktaAuth = new OktaAuth(oktaConfig);

<Security oktaAuth={oktaAuth}>
  <App />
</Security>
```

Protected route example:
```typescript
import { useOktaAuth } from '@okta/okta-react';

function App() {
  const { authState, oktaAuth } = useOktaAuth();
  
  if (!authState) return <Loading />;
  
  if (!authState.isAuthenticated) {
    return <LoginButton onClick={() => oktaAuth.signInWithRedirect()} />;
  }
  
  return <Dashboard />;
}
```

### Managing Access

**To grant access:**
1. Add user to `SG-StoreTechOps-Users` group in Azure AD
2. Wait for sync to Okta (or manual sync)
3. User can now log in

**To revoke access:**
1. Remove user from the AD group
2. User's next token refresh will fail
3. Active sessions will expire based on token lifetime

### Security Considerations

- Tokens expire after 1 hour (configurable in Okta)
- Refresh tokens allow seamless re-authentication
- All API calls require valid token
- HTTPS enforced on all endpoints
- Tokens stored in memory (not localStorage) to prevent XSS attacks

## License

Proprietary - Internal use only.
