// Use Vercel serverless functions in production, Vite proxy in development
const API_BASE_URL = '/api';  // Vite proxy will forward to localhost:3001 in development

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
    const response = await fetch(`${API_BASE_URL}/page`, {
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
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties }),
    });
    if (!response.ok) {
      throw new Error('Failed to update page');
    }
    return response.json();
  },

  // Delete (archive) a page
  async deletePage(pageId) {
    const response = await fetch(`${API_BASE_URL}/page/${pageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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

  // Append blocks to a page
  async appendBlocks(pageId, blocks) {
    const response = await fetch(`${API_BASE_URL}/blocks/${pageId}/append`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blocks }),
    });
    if (!response.ok) {
      throw new Error('Failed to append blocks');
    }
    return response.json();
  },

  // Delete a block
  async deleteBlock(blockId) {
    const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete block');
    }
    return response.json();
  },

  // Update a block
  async updateBlock(blockId, content) {
    const response = await fetch(`${API_BASE_URL}/blocks/${blockId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to update block');
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
