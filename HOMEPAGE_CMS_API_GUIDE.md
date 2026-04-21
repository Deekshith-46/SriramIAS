# 🏠 HomePage CMS - Complete API Guide

## 📅 Implementation Date
**Created:** April 21, 2026

---

## 🚀 System Overview

This is a **Single Page CMS** for managing the HomePage content. The entire homepage is stored as **ONE document** in the database with 7 structured sections.

### ✅ Key Features:
- **Single Document** - Only ONE record in the database
- **Section-based** - 7 distinct sections for different content
- **Partial Updates** - Update only the sections you need
- **Public Access** - GET endpoint is public for frontend rendering
- **Admin Only** - POST endpoint restricted to Super Admin

---

## 📁 Database Design

### Model: `HomePage.js`

```
HomePage (Single Document)
├── section1: Video Tutorial
├── section2: Hero Section
├── section3: Topper Highlight (Multiple Toppers)
├── section4: Learning Sections
├── section5: Centres
├── section6: Story/Stats
└── section7: YouTube Videos
```

---

## 🔌 Complete API Endpoints

### Base URL
```
{{BASE_URL}} = http://localhost:5000/api
```

---

## 1️⃣ GET HOMEPAGE DATA

### Get All Sections
**GET** `/api/homepage`

**Access:** Public (No authentication required)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "69e7...",
    "section1": {
      "videoUrl": "https://youtube.com/watch?v=..."
    },
    "section2": {
      "iconImage": "https://cloudinary.com/.../icon.png",
      "text": "Welcome to Sriram IAS",
      "backgroundImage": "https://cloudinary.com/.../bg.jpg"
    },
    "section3": {
      "title": "OUR TOPPERS",
      "subTitle": "Celebrating Success",
      "toppers": [
        {
          "image": "https://cloudinary.com/.../topper1.jpg",
          "name": "Darshan",
          "rank": "AIR 08",
          "description": "GS Foundation Course"
        },
        {
          "image": "https://cloudinary.com/.../topper2.jpg",
          "name": "Rahul",
          "rank": "AIR 15",
          "description": "Optional Geography"
        }
      ]
    },
    "section4": {
      "title": "OUR LEARNING PROGRAMS",
      "subSections": [
        {
          "title": "Foundation Courses",
          "description": "Comprehensive preparation",
          "images": [
            "https://cloudinary.com/.../img1.jpg",
            "https://cloudinary.com/.../img2.jpg",
            "https://cloudinary.com/.../img3.jpg"
          ]
        }
      ]
    },
    "section5": {
      "title": "OUR CENTRES",
      "cards": [
        {
          "image": "https://cloudinary.com/.../center1.jpg",
          "name": "Hyderabad"
        },
        {
          "image": "https://cloudinary.com/.../center2.jpg",
          "name": "Delhi"
        }
      ]
    },
    "section6": {
      "title": "OUR STORY",
      "image": "https://cloudinary.com/.../story.jpg",
      "description": "15+ years of excellence",
      "subDescription": "Guiding aspirants to success",
      "stats": [
        {
          "number": "50,000+",
          "text": "Students Trained"
        },
        {
          "number": "500+",
          "text": "Selections"
        }
      ]
    },
    "section7": {
      "title": "YOUTUBE VIDEOS",
      "videos": [
        {
          "videoUrl": "https://youtube.com/watch?v=abc123",
          "thumbnail": "https://cloudinary.com/.../thumb1.jpg"
        }
      ]
    },
    "createdAt": "2026-04-21T10:00:00.000Z",
    "updatedAt": "2026-04-21T15:30:00.000Z"
  }
}
```

---

## 2️⃣ SAVE/UPDATE HOMEPAGE

### Create or Update Homepage
**POST** `/api/homepage`

**Access:** Super Admin only  
**Content-Type:** `multipart/form-data`

**Important:** 
- If no document exists → **Creates new**
- If document exists → **Updates using $set** (partial updates supported)
- Use **FormData** for file uploads
- Arrays (toppers, cards, videos, etc.) should be sent as **JSON strings**

---

### FormData Field Naming Convention:

**For simple fields:**
```
section2_text = "Welcome to Sriram IAS"
section3_title = "OUR TOPPERS"
```

**For image fields:**
```
section2_iconImage = [FILE]
section2_backgroundImage = [FILE]
section6_image = [FILE]
```

**For array fields (send as JSON string):**
```
section3_toppers = '[{"name":"Darshan","rank":"AIR 08","description":"GS Foundation"}]'
section5_cards = '[{"name":"Hyderabad"}]'
section7_videos = '[{"videoUrl":"https://youtube.com/..."}]'
```

**For array image fields:**
```
section3_toppers_images = [FILE1], [FILE2], [FILE3]
section5_cards_images = [FILE1], [FILE2]
section7_videos_thumbnails = [FILE1], [FILE2]
```

---

### Example 1: Create Full Homepage (All Sections)

**Body:**
```json
{
  "section1": {
    "videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  "section2": {
    "iconImage": "https://res.cloudinary.com/demo/image/upload/icon.png",
    "text": "India's Best IAS Coaching",
    "backgroundImage": "https://res.cloudinary.com/demo/image/upload/hero-bg.jpg"
  },
  "section3": {
    "title": "OUR TOPPERS",
    "subTitle": "Celebrating Success Stories",
    "toppers": [
      {
        "image": "https://res.cloudinary.com/demo/image/upload/topper1.jpg",
        "name": "Darshan Kumar",
        "rank": "AIR 08",
        "description": "GS Foundation Course 2025"
      },
      {
        "image": "https://res.cloudinary.com/demo/image/upload/topper2.jpg",
        "name": "Priya Sharma",
        "rank": "AIR 15",
        "description": "Optional - Geography"
      },
      {
        "image": "https://res.cloudinary.com/demo/image/upload/topper3.jpg",
        "name": "Rahul Verma",
        "rank": "AIR 22",
        "description": "Optional - Public Administration"
      }
    ]
  },
  "section4": {
    "title": "OUR LEARNING PROGRAMS",
    "subSections": [
      {
        "title": "Foundation Courses",
        "description": "Comprehensive preparation for UPSC CSE",
        "images": [
          "https://res.cloudinary.com/demo/image/upload/foundation1.jpg",
          "https://res.cloudinary.com/demo/image/upload/foundation2.jpg",
          "https://res.cloudinary.com/demo/image/upload/foundation3.jpg"
        ]
      },
      {
        "title": "Test Series",
        "description": "Mock tests and practice papers",
        "images": [
          "https://res.cloudinary.com/demo/image/upload/test1.jpg",
          "https://res.cloudinary.com/demo/image/upload/test2.jpg",
          "https://res.cloudinary.com/demo/image/upload/test3.jpg"
        ]
      }
    ]
  },
  "section5": {
    "title": "OUR CENTRES",
    "cards": [
      {
        "image": "https://res.cloudinary.com/demo/image/upload/hyderabad.jpg",
        "name": "Hyderabad"
      },
      {
        "image": "https://res.cloudinary.com/demo/image/upload/delhi.jpg",
        "name": "Delhi"
      },
      {
        "image": "https://res.cloudinary.com/demo/image/upload/bengaluru.jpg",
        "name": "Bengaluru"
      }
    ]
  },
  "section6": {
    "title": "OUR STORY",
    "image": "https://res.cloudinary.com/demo/image/upload/story.jpg",
    "description": "15+ years of excellence in civil services coaching",
    "subDescription": "Guiding thousands of aspirants to achieve their IAS dream",
    "stats": [
      {
        "number": "50,000+",
        "text": "Students Trained"
      },
      {
        "number": "500+",
        "text": "Final Selections"
      },
      {
        "number": "15+",
        "text": "Years of Excellence"
      },
      {
        "number": "50+",
        "text": "Expert Faculty"
      }
    ]
  },
  "section7": {
    "title": "WATCH OUR VIDEOS",
    "videos": [
      {
        "videoUrl": "https://www.youtube.com/watch?v=abc123",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/video1-thumb.jpg"
      },
      {
        "videoUrl": "https://www.youtube.com/watch?v=def456",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/video2-thumb.jpg"
      }
    ]
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "HomePage created successfully",
  "data": {
    "_id": "69e7...",
    "section1": {...},
    "section2": {...},
    "...": "all sections"
  }
}
```

---

### Example 2: Update Only Section 3 (Toppers)

**Body:**
```json
{
  "section3": {
    "title": "OUR TOPPERS 2026",
    "subTitle": "New Batch Success Stories",
    "toppers": [
      {
        "image": "https://res.cloudinary.com/demo/image/upload/new-topper1.jpg",
        "name": "Amit Patel",
        "rank": "AIR 05",
        "description": "GS Foundation Course 2026"
      },
      {
        "image": "https://res.cloudinary.com/demo/image/upload/new-topper2.jpg",
        "name": "Sneha Reddy",
        "rank": "AIR 12",
        "description": "Optional - Sociology"
      }
    ]
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "HomePage updated successfully",
  "data": {
    "_id": "69e7...",
    "section1": {...},
    "section2": {...},
    "section3": {
      "title": "OUR TOPPERS 2026",
      "subTitle": "New Batch Success Stories",
      "toppers": [...]
    },
    "section4": {...},
    "...": "other sections unchanged"
  }
}
```

✅ **Note:** Only `section3` is updated. All other sections remain unchanged!

---

### Example 3: Update Only Section 7 (YouTube Videos)

**Body:**
```json
{
  "section7": {
    "title": "LATEST VIDEOS",
    "videos": [
      {
        "videoUrl": "https://www.youtube.com/watch?v=xyz789",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/new-video1.jpg"
      },
      {
        "videoUrl": "https://www.youtube.com/watch?v=uvw012",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/new-video2.jpg"
      },
      {
        "videoUrl": "https://www.youtube.com/watch?v=rst345",
        "thumbnail": "https://res.cloudinary.com/demo/image/upload/new-video3.jpg"
      }
    ]
  }
}
```

---

## 📊 Section Structure Reference

### Section 1: Video Tutorial
```json
{
  "videoUrl": "YouTube or video URL"
}
```

### Section 2: Hero
```json
{
  "iconImage": "URL",
  "text": "Hero text",
  "backgroundImage": "URL"
}
```

### Section 3: Toppers (Multiple)
```json
{
  "title": "Section title",
  "subTitle": "Subtitle",
  "toppers": [
    {
      "image": "URL",
      "name": "Student name",
      "rank": "AIR XX",
      "description": "Course info"
    }
  ]
}
```

### Section 4: Learning Sections
```json
{
  "title": "Section title",
  "subSections": [
    {
      "title": "Program name",
      "description": "Description",
      "images": ["url1", "url2", "url3"]
    }
  ]
}
```

### Section 5: Centres
```json
{
  "title": "Section title",
  "cards": [
    {
      "image": "URL",
      "name": "City name"
    }
  ]
}
```

### Section 6: Story/Stats
```json
{
  "title": "Section title",
  "image": "URL",
  "description": "Main description",
  "subDescription": "Sub description",
  "stats": [
    {
      "number": "50,000+",
      "text": "Description"
    }
  ]
}
```

### Section 7: YouTube Videos
```json
{
  "title": "Section title",
  "videos": [
    {
      "videoUrl": "YouTube URL",
      "thumbnail": "URL"
    }
  ]
}
```

---

## 🧪 Step-by-Step API Testing

### Prerequisites
1. Server running on `http://localhost:5000`
2. Super Admin token obtained from login
3. MongoDB connected

---

### Test 1: Get Homepage (Before Creation)

**Request:**
```
GET http://localhost:5000/api/homepage
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "HomePage not configured yet"
}
```

---

### Test 2: Create Homepage (Super Admin)

**Request:**
```
POST http://localhost:5000/api/homepage
Headers:
  Content-Type: application/json
  Authorization: Bearer [SUPER_ADMIN_TOKEN]
```

**Body:** (Use Example 1 from above - Full Homepage)

**Expected Response (201):**
```json
{
  "success": true,
  "message": "HomePage created successfully",
  "data": { ... }
}
```

---

### Test 3: Get Homepage (After Creation)

**Request:**
```
GET http://localhost:5000/api/homepage
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": { ...all sections... }
}
```

---

### Test 4: Update Only Toppers Section

**Request:**
```
POST http://localhost:5000/api/homepage
Headers:
  Content-Type: application/json
  Authorization: Bearer [SUPER_ADMIN_TOKEN]
```

**Body:** (Use Example 2 from above - Only section3)

**Expected Response (200):**
```json
{
  "success": true,
  "message": "HomePage updated successfully",
  "data": {
    "section3": { ...updated... },
    "...": "other sections unchanged"
  }
}
```

---

### Test 5: Verify Partial Update

**Request:**
```
GET http://localhost:5000/api/homepage
```

**Expected:** 
- `section3` should have new data
- All other sections should remain unchanged

---

### Test 6: Test Authorization (Non-Admin)

**Request:**
```
POST http://localhost:5000/api/homepage
Headers:
  Content-Type: application/json
  Authorization: Bearer [STUDENT_TOKEN]
```

**Expected Response (403):**
```json
{
  "message": "Access denied. Insufficient permissions.",
  "required": ["super_admin"],
  "current": "student"
}
```

---

### Test 7: Test Without Token

**Request:**
```
POST http://localhost:5000/api/homepage
Headers:
  Content-Type: application/json
```

**Expected Response (401):**
```json
{
  "message": "Not authorized to access this route"
}
```

---

## 🔐 Role-Based Access Control

| Feature | Super Admin | Center Admin | Student | Public |
|---------|-------------|--------------|---------|--------|
| View Homepage | ✅ | ✅ | ✅ | ✅ |
| Update Homepage | ✅ | ❌ | ❌ | ❌ |

---

## 💡 Important Notes

### ✅ DO:
- Use `$set` for updates (already implemented)
- Send only sections you want to update
- Use valid image URLs (Cloudinary recommended)
- Keep only ONE document in the database

### ❌ DON'T:
- Don't create multiple HomePage documents
- Don't send unnecessary sections in update
- Don't use invalid URLs
- Don't allow non-admin users to update

---

## 🎯 Frontend Integration Tips

### React Example:

```jsx
// Fetch homepage data
const response = await fetch('http://localhost:5000/api/homepage');
const { data } = await response.json();

// Use sections
<HeroSection {...data.section2} />
<ToppersSection {...data.section3} />
<LearningSection {...data.section4} />
```

### Update from Admin Panel:

```jsx
// Update only toppers
const updateToppers = async (toppersData) => {
  await fetch('http://localhost:5000/api/homepage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      section3: toppersData
    })
  });
};
```

---

## 🚀 Quick Reference

| Action | Method | Endpoint | Access |
|--------|--------|----------|--------|
| Get Homepage | GET | `/api/homepage` | Public |
| Create/Update | POST | `/api/homepage` | Super Admin |

---

## 📝 Testing Checklist

- [ ] Test GET before creation (should return 404)
- [ ] Test POST with full data (Super Admin token)
- [ ] Test GET after creation (should return all sections)
- [ ] Test partial update (only section3)
- [ ] Verify other sections unchanged after partial update
- [ ] Test POST without token (should return 401)
- [ ] Test POST with student token (should return 403)
- [ ] Test POST with center admin token (should return 403)
- [ ] Verify only ONE document exists in DB

---

## 🎉 Implementation Complete!

**Files Created:** 4
- `models/HomePage.js` - Database schema
- `controllers/homePageController.js` - Business logic
- `routes/homePageRoutes.js` - Route definitions
- `app.js` - Route registration (updated)

**API Endpoints:** 2
- GET `/api/homepage` - Public
- POST `/api/homepage` - Super Admin only

**Ready for production use!** 🚀
