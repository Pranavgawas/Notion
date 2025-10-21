import { useState, useEffect } from 'react'
import { notionService } from '../services/notionService'
import './PageList.css'

function PageList({ onEdit, onDelete, refreshTrigger }) {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedPages, setExpandedPages] = useState({})
  const [pageBlocks, setPageBlocks] = useState({})

  useEffect(() => {
    fetchPages()
  }, [refreshTrigger])

  const fetchPages = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await notionService.getDatabase()
      setPages(data.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return
    }

    try {
      await notionService.deletePage(pageId)
      setPages(pages.filter(p => p.id !== pageId))
      onDelete()
    } catch (err) {
      alert('Failed to delete page: ' + err.message)
    }
  }

  const toggleExpand = async (pageId) => {
    if (expandedPages[pageId]) {
      setExpandedPages({ ...expandedPages, [pageId]: false })
    } else {
      setExpandedPages({ ...expandedPages, [pageId]: true })
      
      // Fetch blocks if not already loaded
      if (!pageBlocks[pageId]) {
        try {
          const blocks = await notionService.getBlocks(pageId)
          setPageBlocks({ ...pageBlocks, [pageId]: blocks.results || [] })
        } catch (err) {
          console.error('Failed to load blocks:', err)
        }
      }
    }
  }

  const getPageTitle = (page) => {
    return page.properties?.Name?.title?.[0]?.plain_text || 
           page.properties?.title?.title?.[0]?.plain_text || 
           'Untitled'
  }

  const getPageStatus = (page) => {
    return page.properties?.Status?.status?.name || 'No Status'
  }

  const renderBlock = (block) => {
    const type = block.type

    switch (type) {
      case 'paragraph':
        return (
          <p className="block-paragraph">
            {block.paragraph?.rich_text?.[0]?.plain_text || ''}
          </p>
        )
      case 'heading_1':
        return (
          <h1 className="block-heading">
            {block.heading_1?.rich_text?.[0]?.plain_text || ''}
          </h1>
        )
      case 'heading_2':
        return (
          <h2 className="block-heading">
            {block.heading_2?.rich_text?.[0]?.plain_text || ''}
          </h2>
        )
      case 'heading_3':
        return (
          <h3 className="block-heading">
            {block.heading_3?.rich_text?.[0]?.plain_text || ''}
          </h3>
        )
      case 'image':
        const imageUrl = block.image?.external?.url || block.image?.file?.url
        return imageUrl ? (
          <img src={imageUrl} alt="Content" className="block-image" />
        ) : null
      case 'video':
        const videoUrl = block.video?.external?.url
        return videoUrl ? (
          <div className="block-video">
            <video controls src={videoUrl} />
          </div>
        ) : null
      case 'embed':
        return (
          <div className="block-embed">
            <a href={block.embed?.url} target="_blank" rel="noopener noreferrer">
              🔗 {block.embed?.url}
            </a>
          </div>
        )
      case 'bulleted_list_item':
        return (
          <li className="block-list-item">
            {block.bulleted_list_item?.rich_text?.[0]?.plain_text || ''}
          </li>
        )
      default:
        return <div className="block-unknown">Unsupported block type: {type}</div>
    }
  }

  if (loading) {
    return <div className="loading">Loading pages...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={fetchPages}>Retry</button>
      </div>
    )
  }

  return (
    <div className="page-list">
      <div className="list-header">
        <h2>📋 All Pages ({pages.length})</h2>
        <button onClick={fetchPages} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="empty-state">
          <p>No pages found. Create your first page!</p>
        </div>
      ) : (
        <div className="pages-grid">
          {pages.map((page) => (
            <div key={page.id} className="page-card">
              <div className="page-card-header">
                <h3>{getPageTitle(page)}</h3>
                <span className="page-status">{getPageStatus(page)}</span>
              </div>

              <div className="page-meta">
                <p>📅 Created: {new Date(page.created_time).toLocaleDateString()}</p>
                <p>✏️ Updated: {new Date(page.last_edited_time).toLocaleDateString()}</p>
              </div>

              <button 
                className="btn-expand"
                onClick={() => toggleExpand(page.id)}
              >
                {expandedPages[page.id] ? '▲ Hide Content' : '▼ Show Content'}
              </button>

              {expandedPages[page.id] && (
                <div className="page-content">
                  {pageBlocks[page.id] ? (
                    pageBlocks[page.id].length > 0 ? (
                      <div className="blocks-container">
                        {pageBlocks[page.id].map((block) => (
                          <div key={block.id} className="block">
                            {renderBlock(block)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-content">No content yet</p>
                    )
                  ) : (
                    <p className="loading-content">Loading content...</p>
                  )}
                </div>
              )}

              <div className="page-actions">
                <button 
                  className="btn-edit"
                  onClick={() => onEdit(page)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(page.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PageList
