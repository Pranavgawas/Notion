import { useState } from 'react'
import { notionService } from '../services/notionService'
import './CreatePage.css'

function CreatePage({ onSuccess }) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('In Progress')
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: ''
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id, content) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const removeBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < blocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]
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
      // Create the page with properties
      const properties = {
        Name: {
          title: [{ text: { content: title } }]
        },
        Status: {
          status: { name: status }
        }
      }

      const newPage = await notionService.createPage(properties)

      // Add blocks (content) to the page
      if (blocks.length > 0) {
        await notionService.appendBlocks(newPage.id, blocks)
      }

      // Reset form
      setTitle('')
      setStatus('In Progress')
      setBlocks([])
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderBlockInput = (block, index) => {
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
          <input
            type="url"
            placeholder="Enter image URL (https://...)"
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
          />
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
      case 'bulleted_list':
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
      bulleted_list: '•'
    }
    return icons[type] || '?'
  }

  return (
    <div className="create-page">
      <h2>➕ Create New Page</h2>
      
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
            <button type="button" onClick={() => addBlock('bulleted_list')} className="btn-block">
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
                      onClick={() => removeBlock(block.id)}
                      className="btn-remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="block-input">
                  {renderBlockInput(block, index)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : '✓ Create Page'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePage
