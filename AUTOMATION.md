# 🤖 Nexus Automation Bridge (n8n, Zapier)

The Nexus Bridge allows external agents and workflows to trigger marketing cycles, fetch real-time KPIs, and orchestrate project decks.

## 🔗 Bridge Endpoints

All requests must include the `X-Nexus-Key` header.

### 1. Trigger Autonomous Strategy
**POST** `${APP_URL}/api/external/trigger-strategy`
- **Body (JSON):** `{"context": "Market shift in Nairobi"}`
- **Purpose:** Forces Nexus to recalculate the weekly strategy based on a specific external trigger (e.g., a news event or n8n analysis).

### 2. Fetch Performance KPIs
**GET** `${APP_URL}/api/external/kpis`
- **Response:** Current market velocity, reached users, and AI efficiency indices.

### 3. Health Check
**POST** `${APP_URL}/api/external/ping`
- **Purpose:** Verify the bridge connection.

## ⚙️ Setup with n8n

1.  **Add HTTP Request Node:**
    - **Method:** `POST`
    - **URL:** `https://your-nexus-url.com/api/external/trigger-strategy`
2.  **Add Headers:**
    - `X-Nexus-Key`: Your `NEXUS_API_SECRET` (default: `nexus_dev_secret_2026`)
    - `Content-Type`: `application/json`
3.  **Body Parameters:**
    - `context`: A string describing why the automation is triggering (this is logged in the Command Hub).

## 🛡 Security
Ensure `NEXUS_API_SECRET` is set in your environment variables. The default development key should be replaced immediately in production environments.
