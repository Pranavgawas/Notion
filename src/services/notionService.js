// Use Vercel serverless functions in production, local server in development
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Vercel serverless functions
  : 'http://localhost:3001/api';  // Local Express server

export const notionService = {
  // Get all pages from the database
  async getDatabase() {
    const response = await fetch(`${API_BASE_URL}/database`);
    if (!response.ok) {
      throw new Error('Failed to fetch database');
    }
    return response.json();
  },

  // Get a specific page
  async getPage(pageId) {
    const response = await fetch(`${API_BASE_URL}/page/${pageId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }
    return response.json();
  },

  // Create a new page
  async createPage(properties) {
    const response = await fetch(`${API_BASE_URL}/page/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });
    if (!response.ok) {
      throw new Error('Failed to create page');
    }
    return response.json();
  },

  // Update a page
  async updatePage(pageId, properties) {
    const response = await fetch(`${API_BASE_URL}/page/${pageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties, action: 'update' }),
    });
    if (!response.ok) {
      throw new Error('Failed to update page');
    }
    return response.json();
  },

  // Delete (archive) a page
  async deletePage(pageId) {
    const response = await fetch(`${API_BASE_URL}/page/${pageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'delete' }),
    });
    if (!response.ok) {
      throw new Error('Failed to delete page');
    }
    return response.json();
  },

  // Get page blocks/content
  async getBlocks(blockId) {
    const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blocks');
    }
    return response.json();
  },

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Server is not responding');
    }
    return response.json();
  },
};
