# Vite + React + Notion API

A full-stack application built with Vite, React, and Notion API integration.

## 🚀 Features

- **Frontend**: Vite + React for fast development and HMR
- **Backend**: Express.js server for secure Notion API calls
- **Notion Integration**: Full CRUD operations on Notion databases
- **Modern Stack**: Latest versions of React, Vite, and Notion SDK

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- A Notion account
- A Notion integration token

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Give it a name (e.g., "My App")
4. Select the workspace you want to use
5. Click **"Submit"**
6. Copy the **Internal Integration Token** (starts with `secret_`)

### 3. Create a Notion Database

1. Create a new database in Notion
2. Add some properties (e.g., Name, Status, etc.)
3. Share the database with your integration:
   - Click the **"..."** menu in the top right
   - Select **"Add connections"**
   - Find and select your integration

### 4. Get the Database ID

The database ID is in the URL of your database page:
```
https://www.notion.so/{workspace}/{database_id}?v={view_id}
```
Copy the `database_id` part (32 characters without hyphens).

### 5. Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholders with your actual values:

```env
NOTION_API_KEY=secret_your_actual_integration_token
NOTION_DATABASE_ID=your_actual_database_id
PORT=3001
```

### 6. Run the Application

You have two options:

**Option 1: Run both servers separately (recommended for development)**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Option 2: Run both servers together**
```bash
npm run dev:all
```

### 7. Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
Notion/
├── server/
│   └── index.js          # Express backend server
├── src/
│   ├── hooks/
│   │   └── useNotion.js  # React hook for Notion operations
│   ├── services/
│   │   └── notionService.js  # API service functions
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   └── main.jsx          # React entry point
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🛠️ Available API Endpoints

The backend server provides the following endpoints:

- `GET /api/health` - Health check
- `GET /api/database` - Get all pages from the database
- `GET /api/page/:pageId` - Get a specific page
- `POST /api/page` - Create a new page
- `PATCH /api/page/:pageId` - Update a page
- `DELETE /api/page/:pageId` - Archive a page
- `GET /api/blocks/:blockId` - Get page blocks/content

## 🔒 Security Notes

- Never commit your `.env` file to version control
- The Notion API key is kept on the backend server only
- CORS is configured to allow requests from the frontend

## 📚 Resources

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Notion Setup Guide](NOTION_SETUP.md)** - How to get API keys & database ID
- **[Deployment Guide](DEPLOYMENT.md)** - Deploy to Vercel
- **[API Reference](API.md)** - Complete API documentation
- [Notion API Documentation](https://developers.notion.com/)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## 🐛 Troubleshooting

### Server Status Shows "Not Connected"
- Make sure the backend server is running (`npm run server`)
- Check that the PORT in `.env` matches the one used in the frontend

### "Failed to fetch database" Error
- Verify your `NOTION_API_KEY` is correct
- Verify your `NOTION_DATABASE_ID` is correct
- Make sure you've shared the database with your integration

### CORS Errors
- Ensure the backend server is running on the correct port
- Check that CORS is properly configured in `server/index.js`

## 📝 License

MIT


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
