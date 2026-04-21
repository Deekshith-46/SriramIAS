# 🎬 Home Video Module - Complete API Guide

## 📅 Implementation Date
**Created:** April 21, 2026

---

## 🚀 Overview

A **separate, clean video module** for managing homepage videos. No FormData, no file uploads - just simple JSON.

### ✅ Key Features:
- **Simple CRUD** - Add, Get, Update, Delete videos
- **No File Uploads** - Only URLs (videoUrl and thumbnail URL)
- **Independent** - Separate from HomePage CMS
- **Public Read** - Anyone can view videos
- **Admin Write** - Only Super Admin can manage

---

## 📁 Database Design

### Model: `HomeVideo.js`

```
HomeVideo Collection (Multiple Documents)
├── title: String (e.g., "WATCH OUR VIDEOS")
├── videoUrl: String (YouTube URL)
├── videoThumbnail: String (Thumbnail URL)
├── createdAt: Date
└── updatedAt: Date
```

---

## 🔌 API Endpoints

### Base URL
```
{{BASE_URL}} = http://localhost:5000/api
```

---

## 1️⃣ ADD VIDEO

### Create New Video
**POST** `/api/home-videos`

**Access:** Super Admin only  
**Content-Type:** `multipart/form-data`

**FormData Fields:**
| Key | Value | Type |
|-----|-------|------|
| `videoUrl` | YouTube URL | Text |
| `videoThumbnail` | Thumbnail Image | File |

**Example (Postman):**
```
videoUrl = https://www.youtube.com/watch?v=abc123        [Text]
videoThumbnail = [Select File: thumbnail.jpg]            [File]
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Video added successfully",
  "data": {
    "_id": "69e8...",
    "videoUrl": "https://www.youtube.com/watch?v=abc123",
    "videoThumbnail": "https://res.cloudinary.com/dqtasamcu/image/upload/v1776781397/home-videos/thumbnail.jpg",
    "createdAt": "2026-04-21T12:00:00.000Z",
    "updatedAt": "2026-04-21T12:00:00.000Z"
  }
}
```

---

## 2️⃣ GET ALL VIDEOS

### Get All Videos
**GET** `/api/home-videos`

**Access:** Public (No authentication required)

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "69e8...",
      "videoUrl": "https://www.youtube.com/watch?v=video1",
      "videoThumbnail": "https://img.youtube.com/vi/video1/maxresdefault.jpg",
      "createdAt": "2026-04-21T12:00:00.000Z",
      "updatedAt": "2026-04-21T12:00:00.000Z"
    },
    {
      "_id": "69e8...",
      "videoUrl": "https://www.youtube.com/watch?v=video2",
      "videoThumbnail": "https://img.youtube.com/vi/video2/maxresdefault.jpg",
      "createdAt": "2026-04-21T11:00:00.000Z",
      "updatedAt": "2026-04-21T11:00:00.000Z"
    }
  ]
}
```

**Note:** Videos are sorted by `createdAt` (newest first)

---

## 3️⃣ UPDATE VIDEO

### Update Existing Video
**PUT** `/api/home-videos/:id`

**Access:** Super Admin only  
**Content-Type:** `multipart/form-data`

**FormData Fields (update all):**
```
videoUrl = https://www.youtube.com/watch?v=newvideo        [Text]
videoThumbnail = [Select File: new-thumbnail.jpg]          [File]
```

**FormData Fields (update only URL):**
```
videoUrl = https://www.youtube.com/watch?v=updated         [Text]
```

**FormData Fields (update only thumbnail):**
```
videoThumbnail = [Select File: new-thumb.jpg]              [File]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Video updated successfully",
  "data": {
    "_id": "69e8...",
    "videoUrl": "https://www.youtube.com/watch?v=newvideo",
    "videoThumbnail": "https://res.cloudinary.com/dqtasamcu/image/upload/v1776781398/home-videos/new-thumb.jpg",
    "createdAt": "2026-04-21T12:00:00.000Z",
    "updatedAt": "2026-04-21T13:00:00.000Z"
  }
}
```

---

## 4️⃣ DELETE VIDEO

### Delete Video
**DELETE** `/api/home-videos/:id`

**Access:** Super Admin only

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

---

## 🧪 Step-by-Step Testing

### Test 1: Add First Video

**Request:**
```
POST http://localhost:5000/api/home-videos
Headers:
  Authorization: Bearer [SUPER_ADMIN_TOKEN]

Body (form-data):
  videoUrl = https://www.youtube.com/watch?v=dQw4w9WgXcQ        [Text]
  videoThumbnail = [Select File: thumbnail1.jpg]                [File]
```

**Expected:** 201 Created

---

### Test 2: Add Second Video

**Request:**
```
POST http://localhost:5000/api/home-videos
Headers:
  Authorization: Bearer [SUPER_ADMIN_TOKEN]

Body (form-data):
  videoUrl = https://www.youtube.com/watch?v=abc123             [Text]
  videoThumbnail = [Select File: thumbnail2.jpg]                [File]
```

**Expected:** 201 Created

---

### Test 3: Get All Videos

**Request:**
```
GET http://localhost:5000/api/home-videos
```

**Expected:** Returns all videos (newest first)

---

### Test 4: Update Video

**Request:**
```
PUT http://localhost:5000/api/home-videos/[VIDEO_ID]
Headers:
  Authorization: Bearer [SUPER_ADMIN_TOKEN]

Body (form-data):
  videoUrl = https://www.youtube.com/watch?v=updated123        [Text]
  videoThumbnail = [Select File: new-thumbnail.jpg]            [File]
```

**Expected:** 200 OK with updated data

---

### Test 5: Delete Video

**Request:**
```
DELETE http://localhost:5000/api/home-videos/[VIDEO_ID]
Headers:
  Authorization: Bearer [SUPER_ADMIN_TOKEN]
```

**Expected:** 200 OK

---

### Test 6: Test Unauthorized Access

**Request:**
```
POST http://localhost:5000/api/home-videos
Headers:
  Authorization: Bearer [STUDENT_TOKEN]

Body (form-data):
  videoUrl = https://youtube.com/test                            [Text]
  videoThumbnail = [Select File: thumb.jpg]                      [File]
```

**Expected:** 403 Forbidden

---

## 💻 Frontend Integration

### React Example:

```jsx
import { useState, useEffect } from 'react';

function HomeVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/home-videos');
      const result = await response.json();
      setVideos(result.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <section>
      <h2>{videos[0]?.title || 'Our Videos'}</h2>
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            <img src={video.videoThumbnail} alt={video.title} />
            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeVideos;
```

### Add Video (Admin Panel):

```jsx
function AddVideoForm() {
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('videoUrl', videoUrl);
    data.append('videoThumbnail', thumbnailFile);
    
    try {
      const response = await fetch('http://localhost:5000/api/home-videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      alert('Video added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add video');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="YouTube URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnailFile(e.target.files[0])}
        required
      />
      <button type="submit">Add Video</button>
    </form>
  );
}
```

---

## 🎯 YouTube Thumbnail Auto-Generation

### Extract Video ID from YouTube URL:

```javascript
function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Auto-generate thumbnail URL
function getYouTubeThumbnail(videoUrl) {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;
  
  // High quality thumbnail
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // Alternative (medium quality):
  // return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Usage:
const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const thumbnail = getYouTubeThumbnail(videoUrl);
// Returns: https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg
```

### Frontend with Auto-Thumbnail:

```jsx
function AddVideoForm() {
  const [formData, setFormData] = useState({
    videoUrl: '',
    videoThumbnail: ''
  });

  const handleVideoUrlChange = (e) => {
    const videoUrl = e.target.value;
    const thumbnail = getYouTubeThumbnail(videoUrl);
    
    setFormData({
      ...formData,
      videoUrl,
      videoThumbnail: thumbnail || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('videoUrl', formData.videoUrl);
    data.append('videoThumbnail', formData.videoThumbnail);
    
    try {
      const response = await fetch('http://localhost:5000/api/home-videos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();
      alert('Video added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add video');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        placeholder="YouTube URL"
        value={formData.videoUrl}
        onChange={handleVideoUrlChange}
        required
      />
      <input
        type="url"
        placeholder="Thumbnail (auto-generated)"
        value={formData.videoThumbnail}
        onChange={(e) => setFormData({...formData, videoThumbnail: e.target.value})}
        required
      />
      <button type="submit">Add Video</button>
    </form>
  );
}
```

---

## 🔐 Role-Based Access Control

| Feature | Super Admin | Center Admin | Student | Public |
|---------|-------------|--------------|---------|--------|
| Add Video | ✅ | ❌ | ❌ | ❌ |
| View Videos | ✅ | ✅ | ✅ | ✅ |
| Update Video | ✅ | ❌ | ❌ | ❌ |
| Delete Video | ✅ | ❌ | ❌ | ❌ |

---

## 📝 Important Notes

### ✅ DO:
- Use YouTube URL format: `https://www.youtube.com/watch?v=VIDEO_ID`
- Use thumbnail URL: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`
- Keep title consistent across all videos
- Validate URLs before saving

### ❌ DON'T:
- Don't upload files (URLs only)
- Don't mix with HomePage CMS
- Don't use invalid YouTube URLs
- Don't leave fields empty

---

## 🚀 Quick Reference

| Action | Method | Endpoint | Access | Body |
|--------|--------|----------|--------|------|
| Add Video | POST | `/api/home-videos` | Super Admin | FormData |
| Get Videos | GET | `/api/home-videos` | Public | - |
| Update Video | PUT | `/api/home-videos/:id` | Super Admin | FormData |
| Delete Video | DELETE | `/api/home-videos/:id` | Super Admin | - |

---

## 🎉 Benefits of Separate Module

✅ **No FormData complexity**  
✅ **No file upload errors**  
✅ **Simple JSON requests**  
✅ **Independent CRUD operations**  
✅ **Clean separation of concerns**  
✅ **Easy to maintain**  
✅ **Scalable**  

---

## 📦 Postman Testing

### Variables:
```
BASE_URL = http://localhost:5000/api
SUPER_ADMIN_TOKEN = your-token-here
```

### Requests:

**1. Add Video:**
```
POST {{BASE_URL}}/home-videos
Headers: Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Body (form-data):
  videoUrl = https://www.youtube.com/watch?v=abc123        [Text]
  videoThumbnail = [Select File: thumbnail.jpg]            [File]
```

**2. Get All Videos:**
```
GET {{BASE_URL}}/home-videos
```

**3. Update Video:**
```
PUT {{BASE_URL}}/home-videos/[VIDEO_ID]
Headers: Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
Body (form-data):
  videoUrl = https://www.youtube.com/watch?v=newvideo        [Text]
  videoThumbnail = [Select File: new-thumb.jpg]              [File]
```

**4. Delete Video:**
```
DELETE {{BASE_URL}}/home-videos/[VIDEO_ID]
Headers: Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

---

## 🎯 Summary

**Before:** Videos were part of HomePage (Section 7) with complex FormData  
**After:** Separate, clean API with simple JSON requests

**Result:** 
- ✅ No confusion
- ✅ No file uploads
- ✅ Easy to manage
- ✅ Simple CRUD

**Ready to use!** 🚀
