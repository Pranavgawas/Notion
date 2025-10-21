import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

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

// Append blocks to a page
app.post('/api/blocks/:pageId/append', async (req, res) => {
  try {
    const { pageId } = req.params;
    const { blocks } = req.body;

    // Transform blocks to Notion format
    const notionBlocks = blocks.map(block => {
      const blockData = {};
      
      switch (block.type) {
        case 'paragraph':
          blockData.type = 'paragraph';
          blockData.paragraph = {
            rich_text: [{ text: { content: block.content || '' } }]
          };
          break;
        case 'heading_1':
          blockData.type = 'heading_1';
          blockData.heading_1 = {
            rich_text: [{ text: { content: block.content || '' } }]
          };
          break;
        case 'heading_2':
          blockData.type = 'heading_2';
          blockData.heading_2 = {
            rich_text: [{ text: { content: block.content || '' } }]
          };
          break;
        case 'heading_3':
          blockData.type = 'heading_3';
          blockData.heading_3 = {
            rich_text: [{ text: { content: block.content || '' } }]
          };
          break;
        case 'image':
          blockData.type = 'image';
          blockData.image = {
            type: 'external',
            external: { url: block.content }
          };
          break;
        case 'video':
          blockData.type = 'video';
          blockData.video = {
            type: 'external',
            external: { url: block.content }
          };
          break;
        case 'bulleted_list':
        case 'bulleted_list_item':
          blockData.type = 'bulleted_list_item';
          blockData.bulleted_list_item = {
            rich_text: [{ text: { content: block.content || '' } }]
          };
          break;
        default:
          return null;
      }
      
      return blockData;
    }).filter(block => block !== null);

    const response = await notion.blocks.children.append({
      block_id: pageId,
      children: notionBlocks,
    });

    res.json(response);
  } catch (error) {
    console.error('Error appending blocks:', error);
    res.status(500).json({ 
      error: 'Failed to append blocks', 
      details: error.message 
    });
  }
});

// Delete a block
app.delete('/api/blocks/:blockId', async (req, res) => {
  try {
    const { blockId } = req.params;

    const response = await notion.blocks.delete({
      block_id: blockId,
    });

    res.json(response);
  } catch (error) {
    console.error('Error deleting block:', error);
    res.status(500).json({ 
      error: 'Failed to delete block', 
      details: error.message 
    });
  }
});

// Update a block
app.patch('/api/blocks/:blockId', async (req, res) => {
  try {
    const { blockId } = req.params;
    const { content } = req.body;

    const response = await notion.blocks.update({
      block_id: blockId,
      [content.type]: {
        rich_text: [{ text: { content: content.text } }]
      }
    });

    res.json(response);
  } catch (error) {
    console.error('Error updating block:', error);
    res.status(500).json({ 
      error: 'Failed to update block', 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Notion API server running on http://localhost:${PORT}`);
});
