# Deploying to Vercel

## ✅ This project is now Vercel-ready!

I've converted the Express backend to Vercel Serverless Functions, so you can deploy everything to Vercel in one go!

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit with Vercel support"
   git push origin main
   ```

2. **Go to [Vercel](https://vercel.com):**
   - Sign in with your GitHub account
   - Click **"Add New Project"**
   - Import your repository
   - Vercel will auto-detect it's a Vite project

3. **Configure Environment Variables:**
   - Click on **"Environment Variables"**
   - Add these variables:
     ```
     NOTION_API_KEY = secret_your_notion_api_key
     NOTION_DATABASE_ID = your_database_id
     ```
   - Add them for **Production**, **Preview**, and **Development**

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for the build to complete
   - Your app is live! 🎉

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add NOTION_API_KEY
   # Paste your API key when prompted
   
   vercel env add NOTION_DATABASE_ID
   # Paste your database ID when prompted
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## 📁 Project Structure for Vercel

```
Notion/
├── api/                      # Serverless Functions (auto-deployed)
│   ├── health.js            # Health check endpoint
│   ├── database.js          # Get all pages
│   └── page/
│       ├── create.js        # Create new page
│       └── [pageId].js      # Get/Update/Delete page
├── src/                      # React frontend
├── vercel.json              # Vercel configuration
└── package.json
```

## 🔧 How It Works

### Development (Local)
- **Frontend**: `npm run dev` → `http://localhost:5173`
- **Backend**: `npm run server` → `http://localhost:3001`
- API calls go to `http://localhost:3001/api/*`

### Production (Vercel)
- **Frontend**: Built and served by Vercel
- **Backend**: Serverless functions at `/api/*`
- API calls go to `/api/*` (same domain)

The app automatically detects the environment and uses the correct API URL!

## 🌐 API Endpoints on Vercel

Once deployed, your API will be available at:

```
https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/database
https://your-app.vercel.app/api/page/create
https://your-app.vercel.app/api/page/[pageId]
```

## ⚙️ Environment Variables

Make sure to set these in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `NOTION_API_KEY` | Your Notion integration token | `secret_abc123...` |
| `NOTION_DATABASE_ID` | Your Notion database ID | `12345678901234567890123456789012` |

## 🔍 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Make sure `@notionhq/client` is in `dependencies` (not `devDependencies`)

### API Returns 500 Error
- Verify environment variables are set correctly in Vercel
- Check the function logs in Vercel dashboard

### CORS Issues
- The serverless functions include CORS headers
- If issues persist, check browser console for specific errors

## 💡 Pro Tips

1. **Preview Deployments**: Every git push creates a preview deployment
2. **Logs**: View function logs in Vercel dashboard → Your Project → Functions
3. **Environment Variables**: Can be different for Production, Preview, and Development
4. **Custom Domain**: Add your own domain in Project Settings → Domains

## 🎯 Next Steps After Deployment

1. Test all features on the live site
2. Set up a custom domain (optional)
3. Configure analytics (Vercel Analytics)
4. Set up monitoring for API calls

## 📊 Vercel Limits (Free Tier)

- **Serverless Functions**: 100GB-Hrs compute time
- **Bandwidth**: 100GB
- **Build Time**: 6000 minutes/month
- **Function Duration**: 10 seconds max

These limits are usually more than enough for personal projects!

## 🔄 Alternative: Deploy Backend Separately

If you prefer to keep the Express backend separate:

### Frontend on Vercel
1. Deploy normally to Vercel
2. Update `src/services/notionService.js`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com/api';
   ```

### Backend Options:
- **Railway**: [railway.app](https://railway.app) - Great for Node.js
- **Render**: [render.com](https://render.com) - Free tier available
- **Fly.io**: [fly.io](https://fly.io) - Global deployment
- **DigitalOcean**: App Platform

## ✅ Deployment Checklist

- [ ] Notion integration created
- [ ] Database shared with integration
- [ ] Environment variables configured in Vercel
- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Build successful
- [ ] Environment variables added
- [ ] Live site tested
- [ ] API endpoints working

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or open an issue!
