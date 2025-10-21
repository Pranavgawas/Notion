import { useState, useEffect } from 'react'
import { notionService } from './services/notionService'
import PageList from './components/PageList'
import CreatePage from './components/CreatePage'
import EditPage from './components/EditPage'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('list')
  const [serverStatus, setServerStatus] = useState('Checking...')
  const [selectedPage, setSelectedPage] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    // Check server health on mount
    notionService.healthCheck()
      .then(data => setServerStatus(data.status))
      .catch(() => setServerStatus('Not Connected'))
  }, [])

  const handlePageCreated = () => {
    setActiveTab('list')
    setRefreshTrigger(prev => prev + 1)
  }

  const handlePageUpdated = () => {
    setActiveTab('list')
    setSelectedPage(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEdit = (page) => {
    setSelectedPage(page)
    setActiveTab('edit')
  }

  const handlePageDeleted = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="app">
      <header>
        <h1>📝 Notion CRUD Manager</h1>
        <p className="server-status">
          Server: <span className={serverStatus === 'OK' ? 'status-ok' : 'status-error'}>
            {serverStatus}
          </span>
        </p>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'list' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('list')}
        >
          📋 View Pages
        </button>
        <button 
          className={activeTab === 'create' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('create')}
        >
          ➕ Create Page
        </button>
        {selectedPage && (
          <button 
            className={activeTab === 'edit' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('edit')}
          >
            ✏️ Edit Page
          </button>
        )}
      </nav>

      <main>
        {activeTab === 'list' && (
          <PageList 
            onEdit={handleEdit} 
            onDelete={handlePageDeleted}
            refreshTrigger={refreshTrigger}
          />
        )}
        {activeTab === 'create' && (
          <CreatePage onSuccess={handlePageCreated} />
        )}
        {activeTab === 'edit' && selectedPage && (
          <EditPage 
            page={selectedPage} 
            onSuccess={handlePageUpdated}
            onCancel={() => setActiveTab('list')}
          />
        )}
      </main>
    </div>
  )
}

export default App
