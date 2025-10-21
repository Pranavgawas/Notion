# 📝 Notion CRUD Manager - Full Feature Guide

A complete CRUD application for managing Notion pages with rich content including text, images, and videos.

## ✨ Features Implemented

### 1. **View Pages (READ)** 📋
- Display all pages from your Notion database
- View page titles, status, and metadata
- Expand pages to see full content including:
  - Text paragraphs
  - Headings (H1, H2, H3)
  - Images
  - Videos
  - Bullet lists
- Real-time refresh capability

### 2. **Create Pages (CREATE)** ➕
- Create new pages with custom titles
- Set page status (Not Started, In Progress, Done)
- Add multiple content blocks:
  - **📝 Text** - Regular paragraphs
  - **H1, H2, H3** - Different heading levels
  - **🖼️ Images** - Add images via URL
  - **🎥 Videos** - Embed videos via URL
  - **• Lists** - Bullet point lists
- Reorder blocks with up/down controls
- Remove unwanted blocks
- Preview images before saving

### 3. **Edit Pages (UPDATE)** ✏️
- Edit existing page titles and status
- View current content blocks
- Add new blocks to existing pages
- Modify existing text content
- Update image and video URLs
- Delete individual blocks
- Reorder content blocks
- Live preview of changes

### 4. **Delete Pages (DELETE)** 🗑️
- Delete entire pages with confirmation
- Delete individual content blocks
- Automatic cleanup and refresh

## 🚀 How to Use

### Starting the Application

1. **Backend Server** (Terminal 1):
   ```bash
   cd /workspaces/Notion
   node server/index.js
   ```
   Server runs on: http://localhost:3001

2. **Frontend** (Terminal 2):
   ```bash
   cd /workspaces/Notion
   npm run dev
   ```
   App runs on: http://localhost:5173

### Creating a Page with Content

1. Click **"➕ Create Page"** tab
2. Enter a page title
3. Select a status
4. Add content blocks by clicking the block type buttons:
   - **📝 Text** - For paragraphs
   - **H1/H2/H3** - For headings
   - **🖼️ Image** - For images (use full URL like: https://images.unsplash.com/photo-xxx)
   - **🎥 Video** - For videos (use full URL like: https://example.com/video.mp4)
   - **• List** - For bullet points
5. Enter content for each block
6. Reorder blocks using ▲ ▼ buttons
7. Remove blocks with ✕ button
8. Click **"✓ Create Page"** to save

### Viewing Pages

1. Click **"📋 View Pages"** tab
2. See all your pages in a grid
3. Click **"▼ Show Content"** on any page to expand and view its content
4. Images and videos will display inline
5. Click **"🔄 Refresh"** to reload pages

### Editing a Page

1. From the View Pages tab, click **"✏️ Edit"** on any page
2. The Edit Page tab will open with the current content loaded
3. Modify the title or status
4. Edit existing blocks by changing their content
5. Add new blocks using the block buttons
6. Delete blocks with the ✕ button
7. Reorder blocks using ▲ ▼ buttons
8. Click **"✓ Save Changes"** or **"Cancel"** to go back

### Deleting a Page

1. From the View Pages tab, click **"🗑️ Delete"** on any page
2. Confirm the deletion in the popup
3. Page will be removed from Notion (archived)

## 📸 Supported Media

### Images
- Use direct image URLs (must start with `https://`)
- Examples:
  - Unsplash: `https://images.unsplash.com/photo-xxx`
  - Public hosting: `https://yourdomain.com/image.jpg`
  - Any publicly accessible image URL

### Videos
- Use direct video URLs
- Supported formats depend on Notion's support
- Examples:
  - `https://example.com/video.mp4`
  - YouTube embed URLs (via Notion's embed feature)

## 🎨 Content Block Types

| Block Type | Icon | Description | Use Case |
|------------|------|-------------|----------|
| Paragraph | 📝 | Regular text | Main content, descriptions |
| Heading 1 | H1 | Large heading | Page titles, main sections |
| Heading 2 | H2 | Medium heading | Subsections |
| Heading 3 | H3 | Small heading | Minor sections |
| Image | 🖼️ | Image from URL | Photos, diagrams, screenshots |
| Video | 🎥 | Video from URL | Video content, tutorials |
| List | • | Bullet points | Lists, items, features |

## 🔧 Technical Stack

- **Frontend**: React + Vite
- **Backend**: Express.js + Node.js
- **API**: Notion API v2.2.0
- **Styling**: Custom CSS with modern design

## 📝 Notes

- All content is synced with your Notion database in real-time
- Changes are immediately reflected in Notion
- The app uses the official Notion API for all operations
- Images and videos must be publicly accessible URLs
- Block order can be changed anytime during creation or editing

## 🌟 Current Status

✅ All CRUD operations working
✅ Multi-block content support
✅ Image and video embedding
✅ Text formatting with headings
✅ Drag-free reordering (up/down buttons)
✅ Real-time sync with Notion
✅ Modern, responsive UI
✅ Error handling and validation

Enjoy managing your Notion content! 🚀
