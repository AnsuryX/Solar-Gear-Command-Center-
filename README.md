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
Instead of manual planning, Nexus uses Gemini 1.5 Flash to architect a 7-day content schedule.
- **Corridor Focus:** Input your current market goal (e.g., "Commercial ROI in Nairobi").
- **Multi-Platform Adaptation:** Automatically generates "Executive Case Studies" for LinkedIn and "Visual Journeys" for Instagram.
- **Human-in-the-Loop:** All AI content is staged in the **Transmission Queue** for final human approval before going live.

### 2. Global Transmissions (Integrated Social)
- **Direct Linked API:** Connect your LinkedIn profile to publish professional insights directly from the dashboard.
- **Instagram/Meta Integration:** Manage your brand's visual identity through official Graph API endpoints.
- **Approval Workflow:** A dedicated slide-out queue allows you to review, edit, or discard AI-generated drafts.

### 3. The Engine Room (Real Ads Intelligence)
- **Bid Intelligence:** A neural-trigger matrix that suggests ad budget adjustments based on external signals.
- **Atmospheric Pulse:** Logic that triggers Cooling Package ads when heatwaves are detected in regional forecasts.
- **Logistics Guard:** Automatically pauses specific search strings if inventory for related hardware (e.g., inverters) falls below critical levels.

## 🛠 Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Motion, Lucide Icons.
- **Backend:** Express.js (Node.js) with custom OAuth handles.
- **Database:** Firebase/Firestore for real-time state synchronization.
- **AI Engine:** Google Gemini (Generative AI SDK).
- **Social API:** Direct REST integration with LinkedIn and Meta Graph APIs.

## 📦 Deployment & Configuration

### Prerequisites
1. **Firebase Project:** Enable Firestore and Google Authentication.
2. **LinkedIn App:** Create a developer app at [LinkedIn Developers](https://www.linkedin.com/developers/) to get your Client ID/Secret.
3. **Meta App:** Create a Facebook App for Instagram Graph API at [Meta for Developers](https://developers.facebook.com/).

### Environment Setup
Create a `.env` file based on `.env.example`:
```env
GEMINI_API_KEY="your-gemini-key"
REPLICATE_API_TOKEN="your-replicate-key"

# Social Auth
LINKEDIN_CLIENT_ID="your-client-id"
LINKEDIN_CLIENT_SECRET="your-client-secret"
META_APP_ID="your-app-id"
META_APP_SECRET="your-app-secret"

# Ads API
GOOGLE_ADS_DEVELOPER_TOKEN="your-dev-token"
GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"
```

### Running Locally
1. `npm install`
2. `npm run dev` (Starts both the Express server and Vite)

### Deployment to Cloud Run
Nexus is built to be containerized. Ensure your environment variables are configured in the Cloud Run service settings.

---
*Built for SolaGear Kenya & Doha Strategic Growth.*
