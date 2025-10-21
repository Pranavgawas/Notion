# Getting Your Notion API Credentials

## Step 1: Create a Notion Integration

1. **Go to Notion Integrations page:**
   - Visit: https://www.notion.so/my-integrations
   - Log in with your Notion account

2. **Create a new integration:**
   - Click the **"+ New integration"** button
   - Fill in the details:
     - **Name**: Give your integration a name (e.g., "My Vite App")
     - **Associated workspace**: Select your workspace
     - **Type**: Keep as "Internal"
   - Click **"Submit"**

3. **Copy your API Key:**
   - After creating, you'll see the **"Internal Integration Token"**
   - It looks like: `secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXX`
   - Click **"Show"** and then **"Copy"**
   - This is your `NOTION_API_KEY` ✅

## Step 2: Create and Share a Notion Database

1. **Create a database:**
   - Open Notion and create a new page
   - Type `/database` and select "Table - Inline" or "Table - Full page"
   - Add some properties (columns) like:
     - Name (Title) - usually created by default
     - Status (Select)
     - Date (Date)
     - etc.

2. **Share the database with your integration:**
   - Open your database page
   - Click the **"..."** (three dots) in the top right corner
   - Select **"Add connections"** or **"Connect to"**
   - Search for and select your integration name
   - Click **"Confirm"**
   
   ⚠️ **Important**: Your integration won't be able to access the database until you share it!

3. **Get the Database ID:**
   - Look at the URL of your database page
   - It looks like: `https://www.notion.so/{workspace}/DATABASE_ID?v=VIEW_ID`
   - Copy the **DATABASE_ID** part (32 characters, may have hyphens)
   - Remove hyphens if present
   - This is your `NOTION_DATABASE_ID` ✅

## Step 3: Update Your .env File

```env
NOTION_API_KEY=secret_your_actual_token_here
NOTION_DATABASE_ID=your_database_id_here
PORT=3001
```

## Quick Example

**Database URL:**
```
https://www.notion.so/myworkspace/12345678901234567890123456789012?v=abcdef
```

**Your Database ID would be:**
```
12345678901234567890123456789012
```

## Testing Your Setup

Once configured, you can test if everything works:

1. Start the backend server:
   ```bash
   npm run server
   ```

2. You should see: `🚀 Notion API server running on http://localhost:3001`

3. Test the connection:
   ```bash
   curl http://localhost:3001/api/health
   ```

4. Start the frontend and click "Fetch Notion Database"

## Troubleshooting

- **401 Unauthorized**: Check your API key is correct
- **404 Not Found**: Check your database ID is correct
- **403 Forbidden**: Make sure you shared the database with your integration
- **400 Bad Request**: The database ID format might be wrong

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion API Getting Started](https://developers.notion.com/docs/getting-started)
- [Create an Integration](https://www.notion.so/my-integrations)
