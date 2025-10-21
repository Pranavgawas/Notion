import { useState, useEffect } from 'react'
import { useNotion } from './hooks/useNotion'
import { notionService } from './services/notionService'
import './App.css'

function App() {
  const { pages, loading, error, fetchDatabase } = useNotion()
  const [serverStatus, setServerStatus] = useState('Checking...')

  useEffect(() => {
    // Check server health on mount
    notionService.healthCheck()
      .then(data => setServerStatus(data.status))
      .catch(() => setServerStatus('Not Connected'))
  }, [])

  const handleFetchPages = () => {
    fetchDatabase()
  }

  return (
    <div className="app">
      <header>
        <h1>🎯 Vite + React + Notion API</h1>
        <p className="server-status">
          Server Status: <span className={serverStatus === 'OK' ? 'status-ok' : 'status-error'}>
            {serverStatus}
          </span>
        </p>
      </header>

      <main>
        <div className="card">
          <button onClick={handleFetchPages} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Notion Database'}
          </button>
          
          {error && (
            <div className="error">
              <p>Error: {error}</p>
              <p className="hint">Make sure to configure your .env file with your Notion API credentials</p>
            </div>
          )}

          {pages.length > 0 && (
            <div className="pages-container">
              <h2>Database Pages ({pages.length})</h2>
              <div className="pages-list">
                {pages.map((page) => (
                  <div key={page.id} className="page-card">
                    <h3>
                      {page.properties?.Name?.title?.[0]?.plain_text || 
                       page.properties?.title?.title?.[0]?.plain_text || 
                       'Untitled'}
                    </h3>
                    <p className="page-id">ID: {page.id}</p>
                    <p className="page-date">
                      Created: {new Date(page.created_time).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && pages.length === 0 && !error && (
            <div className="empty-state">
              <p>Click the button above to fetch your Notion database pages</p>
            </div>
          )}
        </div>

        <div className="setup-instructions">
          <h3>Setup Instructions:</h3>
          <ol>
            <li>Create a Notion integration at <a href="https://www.notion.so/my-integrations" target="_blank">notion.so/my-integrations</a></li>
            <li>Copy the API key and paste it in the <code>.env</code> file</li>
            <li>Share your database with the integration</li>
            <li>Copy the database ID and paste it in the <code>.env</code> file</li>
            <li>Start the backend server: <code>npm run server</code></li>
            <li>Start the frontend: <code>npm run dev</code></li>
          </ol>
        </div>
      </main>
    </div>
  )
}

export default App
