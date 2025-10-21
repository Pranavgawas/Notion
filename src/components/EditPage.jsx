import { useState, useEffect } from 'react'
import { notionService } from '../services/notionService'
import './EditPage.css'

function EditPage({ page, onSuccess, onCancel }) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('In Progress')
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingBlocks, setLoadingBlocks] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initialize with page data
    const pageTitle = page.properties?.Name?.title?.[0]?.plain_text || 
                     page.properties?.title?.title?.[0]?.plain_text || ''
    const pageStatus = page.properties?.Status?.status?.name || 'In Progress'
    
    setTitle(pageTitle)
    setStatus(pageStatus)

    // Load existing blocks
    loadBlocks()
  }, [page])

  const loadBlocks = async () => {
    setLoadingBlocks(true)
    try {
      const response = await notionService.getBlocks(page.id)
      const loadedBlocks = response.results.map((block, index) => ({
        id: block.id,
        notionId: block.id, // Keep original ID for updates
        type: block.type,
        content: extractBlockContent(block),
        isNew: false
      }))
      setBlocks(loadedBlocks)
    } catch (err) {
      console.error('Failed to load blocks:', err)
      setBlocks([])
    } finally {
      setLoadingBlocks(false)
    }
  }

  const extractBlockContent = (block) => {
    const type = block.type
    switch (type) {
      case 'paragraph':
        return block.paragraph?.rich_text?.[0]?.plain_text || ''
      case 'heading_1':
        return block.heading_1?.rich_text?.[0]?.plain_text || ''
      case 'heading_2':
        return block.heading_2?.rich_text?.[0]?.plain_text || ''
      case 'heading_3':
        return block.heading_3?.rich_text?.[0]?.plain_text || ''
      case 'image':
        return block.image?.external?.url || block.image?.file?.url || ''
      case 'video':
        return block.video?.external?.url || ''
      case 'bulleted_list_item':
        return block.bulleted_list_item?.rich_text?.[0]?.plain_text || ''
      default:
        return ''
    }
  }

  const addBlock = (type) => {
    const newBlock = {
      id: `new-${Date.now()}`,
      type,
      content: '',
      isNew: true
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id, content) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content, modified: true } : block
    ))
  }

  const removeBlock = async (id, notionId) => {
    if (notionId && !id.toString().startsWith('new-')) {
      // Delete existing block from Notion
      try {
        await notionService.deleteBlock(notionId)
      } catch (err) {
        console.error('Failed to delete block:', err)
      }
    }
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < blocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[newIndex]]
      setBlocks(newBlocks)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Update page properties
      const properties = {
        Name: {
          title: [{ text: { content: title } }]
        },
        Status: {
          status: { name: status }
        }
      }

      await notionService.updatePage(page.id, properties)

      // Delete all existing blocks and re-add them
      // This is simpler than trying to update individual blocks
      const existingBlocks = blocks.filter(b => !b.isNew && b.notionId)
      for (const block of existingBlocks) {
        try {
          await notionService.deleteBlock(block.notionId)
        } catch (err) {
          console.error('Failed to delete block:', err)
        }
      }

      // Add all blocks back
      if (blocks.length > 0) {
        await notionService.appendBlocks(page.id, blocks)
      }

      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderBlockInput = (block) => {
    switch (block.type) {
      case 'paragraph':
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        return (
          <textarea
            placeholder={`Enter ${block.type.replace('_', ' ')} text...`}
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            rows={3}
          />
        )
      case 'image':
        return (
          <div>
            <input
              type="url"
              placeholder="Enter image URL (https://...)"
              value={block.content}
              onChange={(e) => updateBlock(block.id, e.target.value)}
            />
            {block.content && (
              <img src={block.content} alt="Preview" className="image-preview" />
            )}
          </div>
        )
      case 'video':
        return (
          <input
            type="url"
            placeholder="Enter video URL (https://...)"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
          />
        )
      case 'bulleted_list_item':
        return (
          <input
            type="text"
            placeholder="Enter list item..."
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
          />
        )
      default:
        return null
    }
  }

  const getBlockIcon = (type) => {
    const icons = {
      paragraph: '📝',
      heading_1: 'H1',
      heading_2: 'H2',
      heading_3: 'H3',
      image: '🖼️',
      video: '🎥',
      bulleted_list_item: '•'
    }
    return icons[type] || '?'
  }

  if (loadingBlocks) {
    return <div className="loading">Loading page content...</div>
  }

  return (
    <div className="edit-page">
      <h2>✏️ Edit Page</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Page Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title..."
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label>Content Blocks</label>
          <div className="block-buttons">
            <button type="button" onClick={() => addBlock('paragraph')} className="btn-block">
              📝 Text
            </button>
            <button type="button" onClick={() => addBlock('heading_1')} className="btn-block">
              H1 Heading
            </button>
            <button type="button" onClick={() => addBlock('heading_2')} className="btn-block">
              H2 Heading
            </button>
            <button type="button" onClick={() => addBlock('heading_3')} className="btn-block">
              H3 Heading
            </button>
            <button type="button" onClick={() => addBlock('image')} className="btn-block">
              🖼️ Image
            </button>
            <button type="button" onClick={() => addBlock('video')} className="btn-block">
              🎥 Video
            </button>
            <button type="button" onClick={() => addBlock('bulleted_list_item')} className="btn-block">
              • List
            </button>
          </div>
        </div>

        {blocks.length > 0 && (
          <div className="blocks-list">
            {blocks.map((block, index) => (
              <div key={block.id} className="block-item">
                <div className="block-header">
                  <span className="block-icon">{getBlockIcon(block.type)}</span>
                  <span className="block-type">{block.type.replace('_', ' ')}</span>
                  <div className="block-controls">
                    <button 
                      type="button"
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="btn-move"
                    >
                      ▲
                    </button>
                    <button 
                      type="button"
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="btn-move"
                    >
                      ▼
                    </button>
                    <button 
                      type="button"
                      onClick={() => removeBlock(block.id, block.notionId)}
                      className="btn-remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="block-input">
                  {renderBlockInput(block)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : '✓ Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPage
