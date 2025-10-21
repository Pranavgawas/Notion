import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pageId } = req.query;

  if (!pageId) {
    return res.status(400).json({ error: 'Page ID is required' });
  }

  try {
    if (req.method === 'GET') {
      // Get page details
      const response = await notion.pages.retrieve({
        page_id: pageId,
      });
      return res.status(200).json(response);
    }

    if (req.method === 'POST') {
      const { properties, action } = req.body;

      if (action === 'update') {
        // Update page
        const response = await notion.pages.update({
          page_id: pageId,
          properties: properties,
        });
        return res.status(200).json(response);
      }

      if (action === 'delete') {
        // Archive page
        const response = await notion.pages.update({
          page_id: pageId,
          archived: true,
        });
        return res.status(200).json(response);
      }

      return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error with page:', error);
    res.status(500).json({
      error: 'Failed to process page request',
      details: error.message,
    });
  }
}
