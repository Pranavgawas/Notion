import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@notionhq/client';

const { Client } = pkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Notion API server is running' });
});

// Get database content
app.get('/api/database', async (req, res) => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!databaseId) {
      return res.status(400).json({ error: 'Database ID not configured' });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching database:', error);
    res.status(500).json({ 
      error: 'Failed to fetch database', 
      details: error.message 
    });
  }
});

// Get a specific page
app.get('/api/page/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    
    const response = await notion.pages.retrieve({
      page_id: pageId,
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ 
      error: 'Failed to fetch page', 
      details: error.message 
    });
  }
});

// Create a new page in the database
app.post('/api/page', async (req, res) => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const { properties } = req.body;

    if (!databaseId) {
      return res.status(400).json({ error: 'Database ID not configured' });
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
    });

    res.json(response);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ 
      error: 'Failed to create page', 
      details: error.message 
    });
  }
});

// Update a page
app.patch('/api/page/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { properties } = req.body;

    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    });

    res.json(response);
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ 
      error: 'Failed to update page', 
      details: error.message 
    });
  }
});

// Delete a page (archive)
app.delete('/api/page/:pageId', async (req, res) => {
  try {
    const { pageId } = req.params;

    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });

    res.json(response);
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ 
      error: 'Failed to delete page', 
      details: error.message 
    });
  }
});

// Get page blocks/content
app.get('/api/blocks/:blockId', async (req, res) => {
  try {
    const { blockId } = req.params;

    const response = await notion.blocks.children.list({
      block_id: blockId,
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching blocks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blocks', 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Notion API server running on http://localhost:${PORT}`);
});
