# 🏠 HomePage CMS - FormData API Guide

## 🚀 Quick Overview

**Single Page CMS** with **FormData** uploads for images.

### API Endpoints:
- **GET** `/api/homepage` - Public (Get all sections)
- **POST** `/api/homepage` - Super Admin only (Create/Update with FormData)

---

## 📋 FormData Field Reference

### Section 1: Video Tutorial
```
section1_videoUrl = "https://youtube.com/watch?v=..."
```

### Section 2: Hero
```
section2_iconImage = [FILE]
section2_text = "Welcome Text"
section2_backgroundImage = [FILE]
```

### Section 3: Toppers (Multiple)
```
section3_title = "OUR TOPPERS"
section3_subTitle = "Success Stories"
section3_toppers = '[{"name":"Darshan","rank":"AIR 08","description":"GS Foundation"}]'
section3_toppers_images = [FILE1], [FILE2], [FILE3]
```

### Section 4: Learning Programs
```
section4_title = "OUR PROGRAMS"
section4_subSections = '[{"title":"Foundation","description":"Prep","images":["url1","url2","url3"]}]'
```

### Section 5: Centres
```
section5_title = "OUR CENTRES"
section5_cards = '[{"name":"Hyderabad"},{"name":"Delhi"}]'
section5_cards_images = [FILE1], [FILE2]
```

### Section 6: Story & Stats
```
section6_title = "OUR STORY"
section6_image = [FILE]
section6_description = "15+ years excellence"
section6_subDescription = "Guiding aspirants"
section6_stats = '    '
```

### Section 7: YouTube Videos
```
section7_title = "WATCH VIDEOS"
section7_videos = '[{"videoUrl":"https://youtube.com/...","thumbnail":"thumb url"}]'
section7_videos_thumbnails = [FILE1], [FILE2]
```

---

## 🧪 Postman Testing Guide

### Test 1: Get Homepage (Public)

**Method:** GET  
**URL:** `{{BASE_URL}}/homepage`

**Expected:** Returns all sections or 404 if not created

---

### Test 2: Create Full Homepage (Super Admin)

**Method:** POST  
**URL:** `{{BASE_URL}}/homepage`  
**Headers:**
```
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

**Body (form-data):**

| Key | Value | Type |
|-----|-------|------|
| `section1_videoUrl` | `https://youtube.com/watch?v=abc123` | Text |
| `section2_iconImage` | [Select File: icon.png] | File |
| `section2_text` | `India's Best IAS Coaching` | Text |
| `section2_backgroundImage` | [Select File: hero-bg.jpg] | File |
| `section3_title` | `OUR TOPPERS` | Text |
| `section3_subTitle` | `Celebrating Success` | Text |
| `section3_toppers` | `[{"name":"Darshan","rank":"AIR 08","description":"GS Foundation 2025"},{"name":"Priya","rank":"AIR 15","description":"Optional Geography"}]` | Text |
| `section3_toppers_images` | [Select File: topper1.jpg] | File |
| `section3_toppers_images` | [Select File: topper2.jpg] | File |
| `section4_title` | `OUR LEARNING PROGRAMS` | Text |
| `section4_subSections` | `[{"title":"Foundation Courses","description":"Comprehensive UPSC prep","images":["https://cloudinary.com/img1.jpg","https://cloudinary.com/img2.jpg","https://cloudinary.com/img3.jpg"]}]` | Text |
| `section5_title` | `OUR CENTRES` | Text |
| `section5_cards` | `[{"name":"Hyderabad"},{"name":"Delhi"},{"name":"Bengaluru"}]` | Text |
| `section5_cards_images` | [Select File: hyd.jpg] | File |
| `section5_cards_images` | [Select File: delhi.jpg] | File |
| `section5_cards_images` | [Select File: blr.jpg] | File |
| `section6_title` | `OUR STORY` | Text |
| `section6_image` | [Select File: story.jpg] | File |
| `section6_description` | `15+ years of excellence` | Text |
| `section6_subDescription` | `Guiding aspirants to success` | Text |
| `section6_stats` | `[{"number":"50,000+","text":"Students Trained"},{"number":"500+","text":"Final Selections"},{"number":"15+","text":"Years"}]` | Text |
| `section7_title` | `WATCH OUR VIDEOS` | Text |
| `section7_videos` | `[{"videoUrl":"https://youtube.com/watch?v=xyz","thumbnail":"https://cloudinary.com/thumb1.jpg"}]` | Text |
| `section7_videos_thumbnails` | [Select File: thumb1.jpg] | File |

**Response (201 Created):**
```json
{
  "success": true,
  "message": "HomePage created successfully",
  "data": { ... }
}
```

---

### Test 3: Update Only Toppers Section

**Method:** POST  
**URL:** `{{BASE_URL}}/homepage`  
**Headers:**
```
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

**Body (form-data):**

| Key | Value | Type |
|-----|-------|------|
| `section3_title` | `OUR TOPPERS 2026` | Text |
| `section3_subTitle` | `New Batch Success` | Text |
| `section3_toppers` | `[{"name":"Amit","rank":"AIR 05","description":"GS 2026"},{"name":"Sneha","rank":"AIR 12","description":"Sociology"}]` | Text |
| `section3_toppers_images` | [Select File: new-topper1.jpg] | File |
| `section3_toppers_images` | [Select File: new-topper2.jpg] | File |

✅ **Note:** Only section3 updates, all other sections remain unchanged!

---

### Test 4: Update Only YouTube Videos

**Method:** POST  
**URL:** `{{BASE_URL}}/homepage`  
**Headers:**
```
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

**Body (form-data):**

| Key | Value | Type |
|-----|-------|------|
| `section7_title` | `LATEST VIDEOS` | Text |
| `section7_videos` | `[{"videoUrl":"https://youtube.com/watch?v=new1","thumbnail":"https://cloudinary.com/new-thumb1.jpg"},{"videoUrl":"https://youtube.com/watch?v=new2","thumbnail":"https://cloudinary.com/new-thumb2.jpg"}]` | Text |
| `section7_videos_thumbnails` | [Select File: new-thumb1.jpg] | File |
| `section7_videos_thumbnails` | [Select File: new-thumb2.jpg] | File |

---

### Test 5: Update Only Story & Stats

**Method:** POST  
**URL:** `{{BASE_URL}}/homepage`  
**Headers:**
```
Authorization: Bearer {{SUPER_ADMIN_TOKEN}}
```

**Body (form-data):**

| Key | Value | Type |
|-----|-------|------|
| `section6_title` | `OUR JOURNEY` | Text |
| `section6_image` | [Select File: new-story.jpg] | File |
| `section6_description` | `20+ years of excellence` | Text |
| `section6_subDescription` | `Empowering aspirants since 2006` | Text |
| `section6_stats` | `[{"number":"75,000+","text":"Students"},{"number":"750+","text":"Selections"},{"number":"20+","text":"Years"}]` | Text |

---

## 💻 Frontend Integration (React Example)

```javascript
const updateHomePage = async (formData) => {
  try {
    const response = await fetch('http://localhost:5000/api/homepage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type - browser sets it automatically for FormData
      },
      body: formData
    });

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage:
const formData = new FormData();

// Add text fields
formData.append('section3_title', 'OUR TOPPERS');
formData.append('section3_subTitle', 'Success Stories');

// Add arrays as JSON strings
formData.append('section3_toppers', JSON.stringify([
  { name: 'Darshan', rank: 'AIR 08', description: 'GS Foundation' },
  { name: 'Priya', rank: 'AIR 15', description: 'Geography' }
]));

// Add files
formData.append('section3_toppers_images', file1);
formData.append('section3_toppers_images', file2);

// Send
updateHomePage(formData);
```

---

## 📝 Important Notes

### ✅ DO:
- Use **multipart/form-data** (Postman: select "form-data")
- Send arrays as **JSON strings** (use `JSON.stringify()`)
- Use same key name multiple times for multiple files
- Only send sections you want to update

### ❌ DON'T:
- Don't send JSON body
- Don't set Content-Type header manually (browser/Postman does it)
- Don't send all sections if you only want to update one
- Don't forget authorization token

---

## 🔑 Key Points

1. **Partial Updates**: Send only the fields you want to change
2. **File Uploads**: Images auto-upload to Cloudinary
3. **Arrays**: Must be JSON strings, not actual arrays
4. **Multiple Files**: Use same key name (e.g., `section3_toppers_images` twice)
5. **One Document**: Only ONE homepage exists in database

---

## 🚀 Quick Test Checklist

- [ ] GET homepage (should return 404 initially)
- [ ] POST with all sections (Super Admin token)
- [ ] GET homepage (should return all data)
- [ ] POST partial update (only section3)
- [ ] GET homepage (verify only section3 changed)
- [ ] Test with student token (should fail - 403)
- [ ] Test without token (should fail - 401)

---

## 📦 Postman Variables

Set these in Postman:
```
BASE_URL = http://localhost:5000/api
SUPER_ADMIN_TOKEN = your-token-here
STUDENT_TOKEN = student-token-here
```

**Ready to test!** 🎉
