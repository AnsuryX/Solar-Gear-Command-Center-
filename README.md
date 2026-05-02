# SolaGear Nexus: AI-Driven Energy Marketing OS

SolaGear Nexus is a specialized, production-ready marketing operating system designed for high-growth solar energy firms. It synchronizes brand intelligence across LinkedIn, Instagram, and Google Ads using advanced AI orchestration.

## 🚀 The Core Problem Solved
Marketing for technical industries like solar energy often suffers from a "Cognitive Gap":
- **Technical Complexity vs. Visual Appeal:** Balancing engineering-heavy ROI data (LinkedIn) with lifestyle-oriented sustainability aesthetics (Instagram).
- **Manual Overhead:** Scaling content across multiple regions (Kenya, Doha, GCC) while maintaining distinct regional voices.
- **Data-Driven Ad Spend:** Connecting local market signals (inventory levels, weather patterns) to real-time ad bidding.

**Nexus automates the architecting, scheduling, and deployment of these signals.**

## ✨ Key Features

### 1. Weekly Strategy Core (AI Analyst)
Nexus orchestrates 7-day content schedules with multi-platform intelligence.
- **Autonomous Mode:** Enable "Auto-Pilot" to let the AI architect, approve, and stage content completely unattended.
- **Image Strategy:** Instead of costly auto-generation, AI suggests detailed visual prompts that you can pair with your existing Google Drive assets.
- **Multi-Model Support:** Toggle between native Gemini 1.5 Flash and OpenRouter (allowing for "Free" or "Lite" models to keep costs at zero).

### 2. Global Transmissions (Integrated Social)
- **Direct Linked API:** Post professional insights via dedicated OAuth handles.
- **Instagram/Meta Integration:** Direct Graph API connection for visual brand storytelling.
- **Google Business Profile (GMB):** Automatically update your local presence with service updates and project highights.
- **Transmission Queue:** A specialized review deck with "Image Strategy" sidebars for manual review when not in Auto-Pilot.

### 3. The Engine Room (Real Ads Intelligence)
- **Auto-Growth:** Toggle autonomous campaign generation based on regional market signals.
- **Atmospheric Pulse:** Logic that triggers Cooling Package ads when heatwaves are detected in Nairobi or Doha.
- **Logistics Guard:** Automatically pauses specific search strings if inventory for panels or inverters falls below threshold.

### 4. Growth Analytics (GA4 Synthesis)
- **Direct GA4 Hook:** Nexus connects directly to your Google Analytics 4 properties to fetch traffic and conversion data.
- **Autonomous Goal Synthesis:** Instead of just showing charts, the AI analyzes traffic patterns to suggest "Growth Reversals"—tactical shifts in strategy to maximize ROI.
- **Unified Google Auth:** One single handshake grants Nexus access to both local business updates (GMB) and global traffic data (GA4).

### 6. Command Center (AI-Driven CRM)
- **Signal Multiplier:** Initialize strategic objectives (e.g., "Nairobi Growth") and let Nexus architect the tactical "Action Deck" (Task List).
- **Project Orchestration:** Track tasks from Backlog to Deployment with AI-assisted status synthesis.

### 7. Executive reporting (The Board Report)
- **Zero-Touch Analysis:** Nexus synthesizes platform data into professional "Board Reports" that justify marketing spend without a manager's manual input.
- **Narrative AI:** Converts raw numbers into executive summaries suitable for stakeholders.

### 6. Nexus Bridge (External Automation)
- **n8n & Zapier Ready:** Use the secure `X-Nexus-Key` protocol to trigger strategy cycles or fetch KPIs from external agent workflows.
- **REST Interface:** Standardized endpoints for custom integrations with third-party CRM or logistics tools.

## ⚙️ Intelligence Configuration (The Nexus Core)
Configure your AI preferences in **System Config**:
- **Providers:** Choose between Gemini (Native) or OpenRouter (External).
- **Control Mode:** Toggle between "Supervised" and "Fully Autonomous" operation.
- **Image Pipeline:** Nexus generates prompts designed to be fulfilled via Google Drive assets or local media libraries.

## 📦 Deployment & Configuration

### Prerequisites
1. **Firebase Project:** Enable Firestore and Google Authentication.
2. **LinkedIn/Meta Apps:** Configure developer portal redirects to `${APP_URL}/api/auth/linkedin/callback` and `${APP_URL}/api/auth/meta/callback`.
3. **Google Drive (Optional):** Define access scopes if using the AI as an asset coordinator.

### Environment Setup
Create a `.env` file based on `.env.example`:
```env
GEMINI_API_KEY="your-gemini-key"
OPENROUTER_API_KEY="your-openrouter-key"
VITE_AI_PROVIDER="openrouter"
VITE_AI_MODEL_ID="google/gemini-2.0-flash-lite-001"
```

### Running Locally
1. `npm install`
2. `npm run dev` (Starts both the Express server and Vite)

### Deployment to Cloud Run
Nexus is built to be containerized. Ensure your environment variables are configured in the Cloud Run service settings.

---
*Built for SolaGear Kenya & Doha Strategic Growth.*
