# 🎓 Complete Course Creation Guide

Complete step-by-step guide with full code examples for creating and managing courses.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Login & Get Token](#step-1-login--get-token)
3. [Step 2: Create Centers](#step-2-create-centers)
4. [Step 3: Create Categories](#step-3-create-categories)
5. [Step 4: Create Course](#step-4-create-course)
6. [Step 5: Get Courses](#step-5-get-courses)
7. [Step 6: Update Course](#step-6-update-course)
8. [Step 7: Delete Course](#step-7-delete-course)
9. [Complete Code Examples](#complete-code-examples)
10. [Important Notes](#important-notes)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before creating a course, ensure you have:

1. ✅ **Super Admin Account** (to create centers and categories)
2. ✅ **Server Running** (nodemon should be active)
3. ✅ **MongoDB Connected** (database is accessible)
4. ✅ **Cloudinary Configured** (for file uploads)
5. ✅ **Authentication Token** (JWT from login)

---

## ⚠️ IMPORTANT: Form-Data JSON Fields

**CRITICAL:** When sending JSON objects in form-data, you MUST use `JSON.stringify()`!

### ✅ CORRECT:
```javascript
formData.append('howItHelps', JSON.stringify({
  howItHelpsTitle: "How This Course Helps",
  howItHelpsTexts: ["text1", "text2"]
}));
```

### ❌ WRONG:
```javascript
// This will NOT work!
formData.append('howItHelpsTitle', 'How This Course Helps');
formData.append('howItHelpsTexts', '["text1", "text2"]');
```

**Applies to:** `keyHighlights`, `whyChoose`, `howItHelps`, `modes`

---

## Step 1: Login & Get Token

### Request:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@sriramias.com",
  "password": "your_password"
}
```

### Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id_here",
    "role": "super_admin",
    "email": "admin@sriramias.com"
  }
}
```

**Save the `token` value** - you'll need it for all subsequent requests.

---

## Step 2: Create Centers

### Create Delhi Center:
```bash
POST http://localhost:5000/api/admin/centers
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Delhi"
}
```

### Response:
```json
{
  "success": true,
  "message": "Center created successfully",
  "center": {
    "_id": "6789abcd1234efgh5678ijkl",
    "name": "Delhi",
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**Save the center `_id`** - you'll need it for creating courses.

---

## Step 3: Create Categories

### Create GS Foundation Category:
```bash
POST http://localhost:5000/api/admin/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "GS Foundation"
}
```

### Response:
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "1234abcd5678efgh9012ijkl",
    "name": "GS Foundation",
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**Save the category `_id`** - you'll need it for creating courses.

---

## Step 4: Create Course

### Complete Example - Delhi 2 Year GS Foundation:

```bash
POST http://localhost:5000/api/courses
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

### Form Data:

```
# Basic Information
title: 2 Year GS Foundation Program
center: 6789abcd1234efgh5678ijkl          # Replace with your center ID
category: 1234abcd5678efgh9012ijkl          # Replace with your category ID
description: Comprehensive 2-year General Studies Foundation program for UPSC CSE preparation
duration: 2 Years
startDate: 2026-06-01                        # Format: YYYY-MM-DD
onlineFees: 150000
offlineFees: 180000
modes: ["online", "offline"]

# Key Highlights (Object with title and array of strings)
keyHighlights: {
  "keyTitle": "Course Highlights",
  "keyHighlightTexts": [
    "Learn from experienced UPSC mentors",
    "Complete study material provided",
    "Weekly assessments included",
    "Individual guidance for each student"
  ]
}

# Why Choose (Object with title and array of objects)
whyChoose: {
  "whyChooseTitle": "Why Choose Us",
  "whyChooseItems": [
    {"whyChooseText": "Proven Track Record", "whyChooseContent": "1000+ selections in last 5 years"},
    {"whyChooseText": "Small Batch Size", "whyChooseContent": "Maximum 30 students per batch"},
    {"whyChooseText": "Individual Attention", "whyChooseContent": "Personal mentorship for each student"},
    {"whyChooseText": "Updated Curriculum", "whyChooseContent": "Latest syllabus and exam pattern"}
  ]
}

# How It Helps (Object with title and array of strings)
howItHelps: {
  "howItHelpsTitle": "How This Course Helps You",
  "howItHelpsTexts": [
    "Build a strong foundation with NCERTs and conceptual lectures",
    "Gain exam orientation through regular MCQs, Mains questions and answer writing",
    "Stay updated and integrated with current affairs seamlessly woven into your syllabus",
    "Develop discipline and consistency with a structured timeline, reviews and progress tracking",
    "Revise effectively with our unique Revision Booklet and extended access to resources",
    "Receive continuous mentorship and motivation throughout your preparation journey"
  ]
}

# Files (Upload actual files)
banner: [Upload banner image - Required]     # JPEG, PNG, WebP, AVIF
highlight: [Upload highlight image]          # JPEG, PNG, WebP, AVIF (Optional)
section: [Upload section image]              # JPEG, PNG, WebP, AVIF (Optional)
gallery: [Upload up to 5 images]             # JPEG, PNG, WebP, AVIF (Optional)
video: [Upload promo video]                  # MP4, GIF (Optional)
brochure: [Upload PDF brochure]              # PDF only (Optional)
```

### Success Response:
```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    "_id": "course_id_here",
    "title": "2 Year GS Foundation Program",
    "slug": "2-year-gs-foundation-program-1712345678901",
    "center": {
      "_id": "6789abcd1234efgh5678ijkl",
      "name": "Delhi"
    },
    "category": {
      "_id": "1234abcd5678efgh9012ijkl",
      "name": "GS Foundation"
    },
    "description": "Comprehensive 2-year General Studies Foundation program for UPSC CSE preparation",
    "startDate": "2026-06-01T00:00:00.000Z",
    "duration": "2 Years",
    "fees": {
      "online": 150000,
      "offline": 180000
    },
    "modes": ["online", "offline"],
    "keyHighlights": {
      "keyTitle": "Course Highlights",
      "keyHighlightTexts": [
        "Learn from experienced UPSC mentors",
        "Complete study material provided",
        "Weekly assessments included",
        "Individual guidance for each student"
      ]
    },
    "whyChoose": {
      "whyChooseTitle": "Why Choose Us",
      "whyChooseItems": [
        {
          "whyChooseText": "Proven Track Record",
          "whyChooseContent": "1000+ selections in last 5 years"
        },
        {
          "whyChooseText": "Small Batch Size",
          "whyChooseContent": "Maximum 30 students per batch"
        }
      ]
    },
    "howItHelps": {
      "howItHelpsTitle": "How This Course Helps You",
      "howItHelpsTexts": [
        "Build a strong foundation with NCERTs and conceptual lectures",
        "Gain exam orientation through regular MCQs, Mains questions and answer writing",
        "Stay updated and integrated with current affairs seamlessly woven into your syllabus",
        "Develop discipline and consistency with a structured timeline, reviews and progress tracking",
        "Revise effectively with our unique Revision Booklet and extended access to resources",
        "Receive continuous mentorship and motivation throughout your preparation journey"
      ]
    },
    "bannerImage": {
      "url": "https://res.cloudinary.com/dqtasamcu/image/upload/v1234/courses/banners/xyz.jpg",
      "public_id": "courses/banners/xyz"
    },
    "brochure": {
      "url": "https://res.cloudinary.com/dqtasamcu/raw/upload/v1234/courses/brochures/abc",
      "public_id": "courses/brochures/abc"
    },
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2026-04-07T10:00:00.000Z",
    "updatedAt": "2026-04-07T10:00:00.000Z"
  }
}
```

**✅ Note:** 
- `center` and `category` are fully populated with names (not just IDs)
- `brochure` URL is the exact Cloudinary URL (no manual .pdf extension added)
- All content sections (`keyHighlights`, `whyChoose`, `howItHelps`) are properly parsed and stored

---

## Step 5: Get Courses

### Get All Courses (Public - No Auth Required):
```bash
GET http://localhost:5000/api/courses
```

### Filter by Center Name:
```bash
GET http://localhost:5000/api/courses?centerName=Delhi
```

### Filter by Category Name:
```bash
GET http://localhost:5000/api/courses?categoryName=GS Foundation
```

### Get Course by ID:
```bash
GET http://localhost:5000/api/courses/COURSE_ID_HERE
```

### Get Course by Slug:
```bash
GET http://localhost:5000/api/courses/slug/2-year-gs-foundation-program-1712345678901
```

### Response Example:
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "courses": [
    {
      "_id": "course_id",
      "title": "2 Year GS Foundation Program",
      "slug": "2-year-gs-foundation-program-1712345678901",
      "center": {
        "_id": "center_id",
        "name": "Delhi"
      },
      "category": {
        "_id": "category_id",
        "name": "GS Foundation"
      },
      "description": "Comprehensive 2-year program",
      "startDate": "2026-06-01T00:00:00.000Z",
      "duration": "2 Years",
      "fees": {
        "online": 150000,
        "offline": 180000
      },
      "modes": ["online", "offline"],
      "keyHighlights": {
        "keyTitle": "Course Highlights",
        "keyHighlightTexts": ["..."]
      },
      "whyChoose": {
        "whyChooseTitle": "Why Choose Us",
        "whyChooseItems": [...]
      },
      "howItHelps": {
        "howItHelpsTitle": "How This Course Helps You",
        "howItHelpsTexts": ["..."]
      },
      "bannerImage": {
        "url": "https://...",
        "public_id": "courses/banners/xyz"
      },
      "brochure": {
        "url": "https://res.cloudinary.com/.../courses/brochures/abc",
        "public_id": "courses/brochures/abc"
      },
      "isActive": true,
      "createdAt": "2026-04-07T10:00:00.000Z"
    }
  ]
}
```

**✅ Note:** All courses include populated `center` and `category` with names!

---

## Step 6: Update Course

```bash
PUT http://localhost:5000/api/courses/COURSE_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

### Update Form Data (Send only fields you want to change):

```
title: Updated Course Title
description: Updated description
onlineFees: 160000
offlineFees: 190000

# Update content sections (must send complete object)
keyHighlights: {
  "keyTitle": "Updated Highlights",
  "keyHighlightTexts": [
    "New highlight 1",
    "New highlight 2"
  ]
}

# Update files (optional - replaces old files)
banner: [New banner image]
brochure: [New PDF brochure]
```

### Response:
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    // Updated course object
  }
}
```

---

## Step 7: Delete Course

```bash
DELETE http://localhost:5000/api/courses/COURSE_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

### Response:
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## Complete Code Examples

### JavaScript/Frontend Example:

```javascript
// Create Course Function
async function createCourse(courseData, files) {
  const formData = new FormData();
  
  // Add basic fields
  formData.append('title', courseData.title);
  formData.append('center', courseData.centerId);
  formData.append('category', courseData.categoryId);
  formData.append('description', courseData.description);
  formData.append('duration', courseData.duration);
  formData.append('startDate', courseData.startDate); // YYYY-MM-DD
  formData.append('onlineFees', courseData.onlineFees);
  formData.append('offlineFees', courseData.offlineFees);
  formData.append('modes', JSON.stringify(courseData.modes));
  
  // Add content sections (as JSON strings)
  formData.append('keyHighlights', JSON.stringify(courseData.keyHighlights));
  formData.append('whyChoose', JSON.stringify(courseData.whyChoose));
  formData.append('howItHelps', JSON.stringify(courseData.howItHelps));
  
  // Add files
  if (files.banner) formData.append('banner', files.banner);
  if (files.highlight) formData.append('highlight', files.highlight);
  if (files.section) formData.append('section', files.section);
  if (files.gallery) {
    files.gallery.forEach(file => formData.append('gallery', file));
  }
  if (files.video) formData.append('video', files.video);
  if (files.brochure) formData.append('brochure', files.brochure);
  
  // Make API request
  const response = await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUR_TOKEN}`
    },
    body: formData
  });
  
  return await response.json();
}

// Usage Example:
const courseData = {
  title: '2 Year GS Foundation Program',
  centerId: '6789abcd1234efgh5678ijkl',
  categoryId: '1234abcd5678efgh9012ijkl',
  description: 'Comprehensive UPSC preparation',
  duration: '2 Years',
  startDate: '2026-06-01',
  onlineFees: 150000,
  offlineFees: 180000,
  modes: ['online', 'offline'],
  keyHighlights: {
    keyTitle: 'Course Highlights',
    keyHighlightTexts: [
      'Expert faculty',
      'Study material',
      'Mock tests'
    ]
  },
  whyChoose: {
    whyChooseTitle: 'Why Choose Us',
    whyChooseItems: [
      { whyChooseText: 'Proven Results', whyChooseContent: '1000+ selections' },
      { whyChooseText: 'Small Batches', whyChooseContent: 'Max 30 students' }
    ]
  },
  howItHelps: {
    howItHelpsTitle: 'How This Course Helps',
    howItHelpsTexts: [
      'Strong foundation',
      'Answer writing skills',
      'Current affairs'
    ]
  }
};

const files = {
  banner: document.getElementById('banner-input').files[0],
  brochure: document.getElementById('brochure-input').files[0]
};

createCourse(courseData, files)
  .then(response => console.log('Course created:', response))
  .catch(error => console.error('Error:', error));
```

### cURL Complete Example:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=2 Year GS Foundation Program" \
  -F "center=6789abcd1234efgh5678ijkl" \
  -F "category=1234abcd5678efgh9012ijkl" \
  -F "description=Comprehensive UPSC preparation" \
  -F "duration=2 Years" \
  -F "startDate=2026-06-01" \
  -F "onlineFees=150000" \
  -F "offlineFees=180000" \
  -F "modes=[\"online\",\"offline\"]" \
  -F 'keyHighlights={"keyTitle":"Course Highlights","keyHighlightTexts":["Expert faculty","Study material","Mock tests"]}' \
  -F 'whyChoose={"whyChooseTitle":"Why Choose Us","whyChooseItems":[{"whyChooseText":"Proven Results","whyChooseContent":"1000+ selections"},{"whyChooseText":"Small Batches","whyChooseContent":"Max 30 students"}]}' \
  -F 'howItHelps={"howItHelpsTitle":"How This Course Helps","howItHelpsTexts":["Strong foundation","Answer writing","Current affairs"]}' \
  -F "banner=@/path/to/banner.jpg" \
  -F "brochure=@/path/to/brochure.pdf"
```

**⚠️ Important:** Notice how `keyHighlights`, `whyChoose`, and `howItHelps` are sent as JSON strings (wrapped in quotes)!

### Postman Setup:

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/courses`
3. **Headers:**
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```
4. **Body → form-data:**

| Key | Value | Type |
|-----|-------|------|
| title | 2 Year GS Foundation Program | Text |
| center | 6789abcd1234efgh5678ijkl | Text |
| category | 1234abcd5678efgh9012ijkl | Text |
| description | Comprehensive UPSC preparation | Text |
| duration | 2 Years | Text |
| startDate | 2026-06-01 | Text |
| onlineFees | 150000 | Text |
| offlineFees | 180000 | Text |
| modes | ["online", "offline"] | Text |
| keyHighlights | `{"keyTitle":"Course Highlights","keyHighlightTexts":["Expert faculty","Study material"]}` | Text |
| whyChoose | `{"whyChooseTitle":"Why Choose Us","whyChooseItems":[{"whyChooseText":"Proven Results","whyChooseContent":"1000+ selections"}]}` | Text |
| howItHelps | `{"howItHelpsTitle":"How This Course Helps","howItHelpsTexts":["Strong foundation","Answer writing"]}` | Text |
| banner | [Select File] | File |
| brochure | [Select File] | File |

---

## Important Notes

### ⚠️ CRITICAL: Form-Data JSON Format

When using multipart/form-data, you **MUST** stringify JSON objects:

**Frontend (JavaScript):**
```javascript
formData.append('howItHelps', JSON.stringify({
  howItHelpsTitle: "How This Course Helps",
  howItHelpsTexts: ["text1", "text2"]
}));
```

**Postman:**
- Set Type to `Text` (not File)
- Value: `{"howItHelpsTitle":"Title","howItHelpsTexts":["text1","text2"]}`

**cURL:**
- Wrap JSON in single quotes: `-F 'howItHelps={"key":"value"}'`

---

### File Types Supported:
- **Images:** JPEG, PNG, WebP, AVIF
- **Videos:** MP4, GIF
- **Documents:** PDF (for brochure only)

### Date Format:
- ✅ **Correct:** `2026-06-01` (YYYY-MM-DD)
- ❌ **Wrong:** `June 1, 2026` or `01/06/2026`

### Content Structure:

**keyHighlights:** One title + array of strings
```json
{
  "keyTitle": "Course Highlights",
  "keyHighlightTexts": ["text1", "text2", "text3"]
}
```

**whyChoose:** One title + array of objects
```json
{
  "whyChooseTitle": "Why Choose Us",
  "whyChooseItems": [
    {"whyChooseText": "Title", "whyChooseContent": "Description"},
    {"whyChooseText": "Title", "whyChooseContent": "Description"}
  ]
}
```

**howItHelps:** One title + array of strings
```json
{
  "howItHelpsTitle": "How This Course Helps",
  "howItHelpsTexts": ["text1", "text2", "text3"]
}
```

### Brochure URL:
- Cloudinary stores PDF with proper `.pdf` extension using `format: 'pdf'` parameter
- Backend ensures correct format during upload
- Example: `https://res.cloudinary.com/.../raw/upload/.../courses/brochures/xyz.pdf`
- URL works correctly in browser and downloads properly

### Population:
- All GET and CREATE responses include populated `center` and `category` objects
- Returns full objects with `name` field, not just IDs

---

## Troubleshooting

### Error: "Required fields missing"
**Fix:** Ensure `title`, `center`, and `category` are provided

### Error: "Invalid date format"
**Fix:** Use YYYY-MM-DD format (e.g., `2026-06-01`)

### Error: "Banner image is required"
**Fix:** Upload a banner image file

### Error: "Invalid PDF file"
**Fix:** Make sure you're uploading a valid PDF file

### Error: "Unknown API key"
**Fix:** Check your Cloudinary credentials in `.env` file

### Issue: howItHelps/keyHighlights/whyChoose returns empty
**Cause:** Not using JSON.stringify in form-data
**Fix:** 
```javascript
// ✅ CORRECT
formData.append('howItHelps', JSON.stringify({
  howItHelpsTitle: "Title",
  howItHelpsTexts: ["text1", "text2"]
}));

// ❌ WRONG - This won't work!
formData.append('howItHelpsTitle', 'Title');
formData.append('howItHelpsTexts', '["text1", "text2"]');
```

### Issue: Brochure URL returns 404 or shows bytecode
**Cause:** PDF not uploaded with correct format parameter
**Fix:** Backend now uses `format: 'pdf'` when uploading to Cloudinary
```javascript
// ✅ CORRECT - Backend code
const brochureResult = await uploadToCloudinary(
  files.brochure[0], 
  'courses/brochures', 
  'raw', 
  'pdf'  // Ensures .pdf extension
);

// This ensures:
// - File stored with .pdf extension
// - URL works correctly in browser
// - Downloads properly
// - No bytecode issues
```

**If you have existing broken uploads:**
1. Delete the old brochure from database
2. Re-upload the PDF (backend will handle format correctly)

### Issue: Center/Category returns only ID
**Cause:** API not populating references
**Fix:** Already fixed in backend - all endpoints now populate center and category
```json
// ✅ EXPECTED RESPONSE
{
  "center": {
    "_id": "...",
    "name": "Delhi"
  },
  "category": {
    "_id": "...",
    "name": "GS Foundation"
  }
}
```

### Debug Tips:
1. Check server console logs for parsing errors
2. Verify form-data payload in Postman/Network tab
3. Ensure JSON fields are properly stringified
4. Restart server after making code changes

---

## Quick Reference

### Required Fields:
- `title` (String)
- `center` (ObjectId)
- `category` (ObjectId)
- `banner` (File - JPEG, PNG, WebP, AVIF)

### Optional Fields:
- `description`, `duration`, `startDate`
- `onlineFees`, `offlineFees`
- `modes`
- `highlight`, `section`, `gallery`, `video`, `brochure` (Files)
- `keyHighlights`, `whyChoose`, `howItHelps` (Content objects)

### API Endpoints:
- `POST /api/courses` - Create course (Protected)
- `GET /api/courses` - Get all courses (Public)
- `GET /api/courses/:id` - Get course by ID (Public)
- `GET /api/courses/slug/:slug` - Get course by slug (Public)
- `PUT /api/courses/:id` - Update course (Protected)
- `DELETE /api/courses/:id` - Delete course (Super Admin only)

---

**Happy Course Creating! 🎓**
