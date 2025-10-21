import { useState, useEffect } from 'react';
import { notionService } from '../services/notionService';

export const useNotion = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notionService.getDatabase();
      setPages(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPage = async (properties) => {
    setLoading(true);
    setError(null);
    try {
      const newPage = await notionService.createPage(properties);
      setPages((prev) => [...prev, newPage]);
      return newPage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePage = async (pageId, properties) => {
    setLoading(true);
    setError(null);
    try {
      const updatedPage = await notionService.updatePage(pageId, properties);
      setPages((prev) =>
        prev.map((page) => (page.id === pageId ? updatedPage : page))
      );
      return updatedPage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (pageId) => {
    setLoading(true);
    setError(null);
    try {
      await notionService.deletePage(pageId);
      setPages((prev) => prev.filter((page) => page.id !== pageId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pages,
    loading,
    error,
    fetchDatabase,
    createPage,
    updatePage,
    deletePage,
  };
};
