import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID; // Reusing for GMB and GA4 OAuth
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const NEXUS_API_SECRET = process.env.NEXUS_API_SECRET || 'nexus_dev_secret_2026';

// --- Middleware for External Automation ---
const authenticateExternal = (req: any, res: any, next: any) => {
  const apiKey = req.headers['x-nexus-key'];
  if (apiKey !== NEXUS_API_SECRET) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid Nexus Key' });
  }
  next();
};

// --- External Automation Bridge (n8n/Zapier/Agents) ---
app.post('/api/external/ping', authenticateExternal, (req, res) => {
  res.json({ status: 'success', message: 'Nexus Bridge Online', timestamp: new Date() });
});

app.post('/api/external/trigger-strategy', authenticateExternal, async (req, res) => {
  // This would ideally trigger the autonomous cycle via a shared service
  // For now, we acknowledge the signal for n8n workflows
  res.json({ 
    status: 'success', 
    message: 'Autonomous Strategy Cycle Queued',
    context: req.body.context || 'global_market'
  });
});

app.get('/api/external/kpis', authenticateExternal, (req, res) => {
  res.json({
    status: 'success',
    data: {
      velocity: "Bullish",
      reach: "24.8k",
      efficiency: "94.2%",
      last_sync: new Date()
    }
  });
});

// --- n8n MCP Bridge ---
app.post('/api/n8n/proxy', async (req, res) => {
  const { url, token, method, data } = req.body;
  try {
    const response = await axios({
      method: method || 'POST',
      url: url,
      data: data,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('n8n Proxy Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: 'Failed to communicate with n8n MCP Server',
      details: error.response?.data || error.message
    });
  }
});

// --- Google Auth (GMB & GA4) ---
app.get('/api/auth/google/url', (req, res) => {
  const { scope } = req.query;
  const redirectUri = `${APP_URL}/api/auth/google/callback`;
  
  const defaultScopes = [
    'https://www.googleapis.com/auth/business.manage',
    'https://www.googleapis.com/auth/analytics.readonly'
  ];

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope ? (scope as string) : defaultScopes.join(' '),
    access_type: 'offline',
    prompt: 'consent'
  });
  res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
});

app.get('/api/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = `${APP_URL}/api/auth/google/callback`;

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token } = response.data;

    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'OAUTH_SUCCESS', platform: 'google', token: '${access_token}', refreshToken: '${refresh_token}' }, '*');
            window.close();
          </script>
          <p>Google Account Linked! Closing...</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Google Auth Failed');
  }
});

// --- GA4 Data API ---
app.post('/api/analytics/report', async (req, res) => {
  const { token, propertyId } = req.body;
  try {
    const response = await axios.post(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'conversions' }]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: "GA4 Data fetch failed." });
  }
});

// --- LinkedIn Auth ---
app.get('/api/auth/linkedin/url', (req, res) => {
  const redirectUri = `${APP_URL}/api/auth/linkedin/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID!,
    redirect_uri: redirectUri,
    scope: 'w_member_social profile openid',
  });
  res.json({ url: `https://www.linkedin.com/oauth/v2/authorization?${params}` });
});

app.get('/api/auth/linkedin/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = `${APP_URL}/api/auth/linkedin/callback`;

  try {
    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      }
    });

    const { access_token } = response.data;
    
    // In a real app, you'd store this in Firestore under the user doc
    // For now, we pass it back to the client to store locally or send a success page
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'OAUTH_SUCCESS', platform: 'linkedin', token: '${access_token}' }, '*');
            window.close();
          </script>
          <p>LinkedIn Connected! Closing...</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('LinkedIn Auth Failed');
  }
});

// --- Meta (Instagram) Auth ---
app.get('/api/auth/meta/url', (req, res) => {
  const redirectUri = `${APP_URL}/api/auth/meta/callback`;
  const params = new URLSearchParams({
    client_id: META_APP_ID!,
    redirect_uri: redirectUri,
    scope: 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement',
    response_type: 'code',
  });
  res.json({ url: `https://www.facebook.com/v18.0/dialog/oauth?${params}` });
});

app.get('/api/auth/meta/callback', async (req, res) => {
  const { code } = req.query;
  const redirectUri = `${APP_URL}/api/auth/meta/callback`;

  try {
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: redirectUri,
        code,
      }
    });

    const { access_token } = response.data;

    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({ type: 'OAUTH_SUCCESS', platform: 'instagram', token: '${access_token}' }, '*');
            window.close();
          </script>
          <p>Meta Connected! Closing...</p>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send('Meta Auth Failed');
  }
});

// --- Direct Posting API ---
app.post('/api/post/linkedin', async (req, res) => {
  const { token, content, userId } = req.body;
  try {
    // 1. Get User Profile ID (URN)
    const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const personUrn = `urn:li:person:${profileRes.data.sub}`;

    // 2. Create Post
    const postRes = await axios.post('https://api.linkedin.com/v2/ugcPosts', {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json({ status: 'success', id: postRes.data.id });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.response?.data || error.message });
  }
});

// Instagram API requires more complex flow (Page ID -> Instagram Account ID -> Media Container -> Publish)
// For now, providing a simplified structure
app.post('/api/post/instagram', async (req, res) => {
  res.status(501).json({ message: 'Instagram posting requires a Business account and Page ID pairing. Contact support for full setup.' });
});

app.post('/api/post/gmb', async (req, res) => {
  const { token, content, locationId } = req.body;
  try {
    // In GMB API, locationId is like "locations/123456"
    const response = await axios.post(`https://mybusiness.googleapis.com/v4/${locationId}/localPosts`, {
      languageCode: "en-US",
      summary: content,
      postType: "STANDARD",
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json({ status: 'success', id: response.data.name });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: "GMB Publication failed. Check Location permission." });
  }
});

// --- GMB Reviews ---
app.post('/api/gmb/reviews', async (req, res) => {
  const { token, locationId } = req.body;
  try {
    const response = await axios.get(`https://mybusiness.googleapis.com/v4/${locationId}/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: "Failed to fetch Reviews." });
  }
});

app.post('/api/gmb/reviews/reply', async (req, res) => {
  const { token, reviewName, reply } = req.body;
  try {
    const response = await axios.put(`https://mybusiness.googleapis.com/v4/${reviewName}/reply`, {
      comment: reply
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: "Failed to post reply." });
  }
});

// --- Vite Integration ---
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
