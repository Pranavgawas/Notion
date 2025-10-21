import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const { properties } = req.body;

    if (!databaseId) {
      return res.status(400).json({ error: 'Database ID not configured' });
    }

    if (!properties) {
      return res.status(400).json({ error: 'Properties are required' });
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({
      error: 'Failed to create page',
      details: error.message,
    });
  }
}
