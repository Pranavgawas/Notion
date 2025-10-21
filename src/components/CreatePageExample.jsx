import { useState } from 'react';
import { notionService } from '../services/notionService';

/**
 * Example component showing how to create a new page in Notion
 * This is a reference implementation - customize based on your database schema
 */
export const CreatePageExample = () => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Example properties structure - adjust based on your database schema
      const properties = {
        // For a "Name" or "Title" property (title type)
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        // Example: Add a "Status" property (select type)
        // Status: {
        //   select: {
        //     name: "In Progress"
        //   }
        // },
        // Example: Add a "Date" property (date type)
        // Date: {
        //   date: {
        //     start: new Date().toISOString().split('T')[0]
        //   }
        // },
      };

      await notionService.createPage(properties);
      setSuccess(true);
      setTitle('');
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page-form">
      <h2>Create New Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter page title"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Page'}
        </button>
      </form>
      {success && <p className="success">Page created successfully! 🎉</p>}
    </div>
  );
};
