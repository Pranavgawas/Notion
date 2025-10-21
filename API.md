# API Reference

## Base URL

- **Local Development**: `http://localhost:3001/api`
- **Production (Vercel)**: `https://your-app.vercel.app/api`

The app automatically uses the correct URL based on the environment.

## Endpoints

### 🏥 Health Check

Check if the API is running.

**GET** `/api/health`

**Response:**
```json
{
  "status": "OK",
  "message": "Notion API serverless functions are running",
  "timestamp": "2025-10-21T10:30:00.000Z"
}
```

---

### 📚 Get Database

Fetch all pages from your Notion database.

**GET** `/api/database`

**Response:**
```json
{
  "object": "list",
  "results": [
    {
      "id": "page-id",
      "properties": { ... },
      "created_time": "2025-10-21T10:00:00.000Z",
      ...
    }
  ],
  "has_more": false,
  "next_cursor": null
}
```

---

### 📄 Create Page

Create a new page in the database.

**POST** `/api/page/create`

**Request Body:**
```json
{
  "properties": {
    "Name": {
      "title": [
        {
          "text": {
            "content": "My New Page"
          }
        }
      ]
    },
    "Status": {
      "select": {
        "name": "In Progress"
      }
    }
  }
}
```

**Response:**
```json
{
  "id": "new-page-id",
  "properties": { ... },
  "created_time": "2025-10-21T10:30:00.000Z",
  ...
}
```

---

### 📖 Get Page

Get details of a specific page.

**GET** `/api/page/[pageId]?pageId=your-page-id`

**Response:**
```json
{
  "id": "page-id",
  "properties": { ... },
  "created_time": "2025-10-21T10:00:00.000Z",
  ...
}
```

---

### ✏️ Update Page

Update properties of a specific page.

**POST** `/api/page/[pageId]?pageId=your-page-id`

**Request Body:**
```json
{
  "action": "update",
  "properties": {
    "Status": {
      "select": {
        "name": "Completed"
      }
    }
  }
}
```

**Response:**
```json
{
  "id": "page-id",
  "properties": { ... },
  "last_edited_time": "2025-10-21T10:35:00.000Z",
  ...
}
```

---

### 🗑️ Delete Page (Archive)

Archive a page (soft delete).

**POST** `/api/page/[pageId]?pageId=your-page-id`

**Request Body:**
```json
{
  "action": "delete"
}
```

**Response:**
```json
{
  "id": "page-id",
  "archived": true,
  ...
}
```

---

## Error Responses

All endpoints may return errors in this format:

```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Common Status Codes

- `200` - Success
- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (database not shared with integration)
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## Property Types Examples

### Title
```json
{
  "Name": {
    "title": [
      { "text": { "content": "Page Title" } }
    ]
  }
}
```

### Rich Text
```json
{
  "Description": {
    "rich_text": [
      { "text": { "content": "Some description" } }
    ]
  }
}
```

### Select
```json
{
  "Status": {
    "select": {
      "name": "In Progress"
    }
  }
}
```

### Multi-Select
```json
{
  "Tags": {
    "multi_select": [
      { "name": "Tag1" },
      { "name": "Tag2" }
    ]
  }
}
```

### Date
```json
{
  "Date": {
    "date": {
      "start": "2025-10-21"
    }
  }
}
```

### Number
```json
{
  "Priority": {
    "number": 5
  }
}
```

### Checkbox
```json
{
  "Completed": {
    "checkbox": true
  }
}
```

### URL
```json
{
  "Link": {
    "url": "https://example.com"
  }
}
```

### Email
```json
{
  "Email": {
    "email": "user@example.com"
  }
}
```

---

## Testing with cURL

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

### Get Database
```bash
curl https://your-app.vercel.app/api/database
```

### Create Page
```bash
curl -X POST https://your-app.vercel.app/api/page/create \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "Name": {
        "title": [
          { "text": { "content": "Test Page" } }
        ]
      }
    }
  }'
```

---

## Rate Limits

Notion API has rate limits:
- **3 requests per second** per integration
- Requests are queued if you exceed this

The Notion SDK automatically handles rate limiting for you.

---

For more details, see the [Notion API Documentation](https://developers.notion.com/reference).
