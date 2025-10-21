# 🚀 Quick Start Guide

## Get Your Notion Credentials

### 1️⃣ Get Notion API Key
1. Go to: **https://www.notion.so/my-integrations**
2. Click **"+ New integration"**
3. Give it a name → Click **"Submit"**
4. Copy the **"Internal Integration Token"** (starts with `secret_`)

### 2️⃣ Get Database ID
1. Create or open a database in Notion
2. Click **"..."** → **"Add connections"** → Select your integration
3. Copy the database ID from the URL:
   ```
   https://www.notion.so/workspace/DATABASE_ID_HERE?v=view_id
                                    ^^^^^^^^^^^^^^^^
   ```

### 3️⃣ Update .env File
```env
NOTION_API_KEY=secret_your_actual_key_here
NOTION_DATABASE_ID=your_database_id_here
PORT=3001
```

## Run Locally

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

Open: **http://localhost:5173**

## Deploy to Vercel

```bash
# Option 1: Via GitHub
git push origin main
# Then import on vercel.com

# Option 2: Via CLI
npm i -g vercel
vercel
```

**Don't forget to add environment variables in Vercel Dashboard!**

---

## 🔗 Useful Links

- Notion Integrations: https://www.notion.so/my-integrations
- Notion API Docs: https://developers.notion.com
- Vercel Dashboard: https://vercel.com/dashboard
- This Project Help: See `NOTION_SETUP.md` and `DEPLOYMENT.md`
