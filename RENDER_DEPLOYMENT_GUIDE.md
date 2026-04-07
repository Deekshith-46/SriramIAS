# 🚀 Deploy to Render - Complete Guide

Step-by-step guide to deploy your Sriram IAS Backend to Render.

---

## 📋 Prerequisites

1. ✅ **GitHub Account** - Your code should be on GitHub
2. ✅ **Render Account** - Sign up at https://render.com
3. ✅ **MongoDB Atlas** - Cloud MongoDB database
4. ✅ **Cloudinary Account** - For file uploads

---

## Step 1: Push Code to GitHub

### If not already on GitHub:

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Sriram IAS Backend"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/sriram-ias?retryWrites=true&w=majority
   ```

---

## Step 3: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Login to Render**: https://dashboard.render.com

2. **Click "New +"** → Select **"Blueprint"**

3. **Connect your GitHub repository**

4. **Render will automatically detect `render.yaml`**

5. **Fill in Environment Variables**:

   | Variable | Value | Where to Get |
   |----------|-------|--------------|
   | `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas |
   | `JWT_SECRET` | `your-super-secret-key-here` | Generate random string |
   | `CLOUDINARY_CLOUD_NAME` | `dqtasamcu` | Cloudinary Dashboard |
   | `CLOUDINARY_API_KEY` | `262836427891748` | Cloudinary Dashboard |
   | `CLOUDINARY_API_SECRET` | `Y-5byKJ_dw4GDwjR_TUTQqL9Fs4` | Cloudinary Dashboard |
   | `FRONTEND_URL` | `http://localhost:3000` or your frontend URL | Your frontend |

6. **Click "Apply"**

7. **Wait for deployment** (~2-5 minutes)

8. **Get your backend URL**: `https://sriram-ias-backend.onrender.com`

---

### Option B: Manual Setup

1. **Login to Render**: https://dashboard.render.com

2. **Click "New +"** → Select **"Web Service"**

3. **Connect your GitHub repository**

4. **Configure**:
   - **Name**: `sriram-ias-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon` (or closest to you)
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Add Environment Variables**:

   Click **"Advanced"** → **"Add Environment Variable"**:

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sriram-ias
   JWT_SECRET=your-super-secret-key-change-this
   JWT_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=dqtasamcu
   CLOUDINARY_API_KEY=262836427891748
   CLOUDINARY_API_SECRET=Y-5byKJ_dw4GDwjR_TUTQqL9Fs4
   FRONTEND_URL=http://localhost:3000
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (~2-5 minutes)

---

## Step 4: Configure Environment Variables

### Required Variables:

```bash
# Node Environment
NODE_ENV=production

# Server Port (Render sets this automatically)
PORT=10000

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sriram-ias?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-random-string-here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dqtasamcu
CLOUDINARY_API_KEY=262836427891748
CLOUDINARY_API_SECRET=Y-5byKJ_dw4GDwjR_TUTQqL9Fs4

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### How to Add in Render Dashboard:

1. Go to your service
2. Click **"Environment"** tab
3. Click **"Edit"**
4. Add each variable
5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## Step 5: Seed Database (First Time Only)

After deployment, you need to create initial admin user and data.

### Option 1: Using Postman/HTTP Client

```bash
# 1. Create Super Admin
POST https://your-app.onrender.com/api/auth/signup
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "admin@sriramias.com",
  "password": "YourSecurePassword123!",
  "role": "super_admin"
}

# 2. Login
POST https://your-app.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "admin@sriramias.com",
  "password": "YourSecurePassword123!"
}

# Save the token from response

# 3. Create Centers
POST https://your-app.onrender.com/api/admin/centers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Delhi"
}

# 4. Create Categories
POST https://your-app.onrender.com/api/admin/categories
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "GS Foundation"
}
```

### Option 2: Create Seed Script

Create `scripts/seedProduction.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Center = require('../models/Center');
const Category = require('../models/Category');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Create Super Admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@sriramias.com',
      password: 'YourSecurePassword123!',
      role: 'super_admin'
    });
    console.log('✅ Super Admin created');

    // Create Centers
    const centers = await Center.create([
      { name: 'Delhi' },
      { name: 'Hyderabad' },
      { name: 'Pune' }
    ]);
    console.log('✅ Centers created');

    // Create Categories
    const categories = await Category.create([
      { name: 'GS Foundation' },
      { name: 'Optional Subjects' },
      { name: 'Test Series' }
    ]);
    console.log('✅ Categories created');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();
```

Run it locally (connects to production MongoDB):
```bash
node scripts/seedProduction.js
```

---

## Step 6: Test Your API

### Health Check:
```bash
GET https://your-app.onrender.com/api/health
```

### Test Course Creation:
```bash
POST https://your-app.onrender.com/api/courses
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

# Add form data as per COURSE_CREATION_GUIDE.md
```

---

## 🔧 Render Configuration Files

### `render.yaml` (Already Created)
- Infrastructure as Code
- Auto-deploys from GitHub
- Defines all environment variables

### `.renderignore` (Already Created)
- Excludes unnecessary files from deployment
- Reduces build time

---

## 📊 Free Tier Limitations

| Feature | Limit |
|---------|-------|
| **Compute** | 750 hours/month |
| **RAM** | 512 MB |
| **Sleeps after** | 15 minutes of inactivity |
| **Build minutes** | 750 hours/month |
| **Bandwidth** | 100 GB/month |

### ⚠️ Important for Free Tier:

1. **Service sleeps** after 15 min inactivity
2. **First request** after sleep takes 30-50 seconds
3. **Use uptime monitor** to keep it awake (e.g., UptimeRobot)
4. **Upgrade to paid** ($7/month) for always-on

---

## 🚀 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account active
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] `render.yaml` or manual setup done
- [ ] All environment variables added
- [ ] Deployment successful
- [ ] Health check endpoint working
- [ ] Admin user created
- [ ] Centers and categories seeded
- [ ] API tested with Postman

---

## 🔍 Troubleshooting

### Build Fails:
```bash
# Check logs in Render dashboard
# Common issues:
# - Missing dependencies in package.json
# - Node version incompatibility
# - Syntax errors in code
```

### App Crashes on Start:
```bash
# Check environment variables
# Verify MongoDB connection string
# Check PORT configuration
```

### CORS Errors:
```bash
# Update FRONTEND_URL in environment variables
# Check cors configuration in app.js
```

### MongoDB Connection Error:
```bash
# Check MONGODB_URI format
# Verify IP whitelist (0.0.0.0/0)
# Check database user credentials
```

---

## 📈 Monitoring

### Render Dashboard:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Bandwidth
- **Deploys**: Deployment history

### External Monitoring (Optional):
- **UptimeRobot**: https://uptimerobot.com
- **Pingdom**: https://www.pingdom.com

---

## 🔄 Auto-Deploy

Render automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Render will automatically build and deploy!
```

---

## 🎯 Your Production URLs

After deployment:

```
Backend API: https://sriram-ias-backend.onrender.com
Health Check: https://sriram-ias-backend.onrender.com/api/health
API Docs: https://sriram-ias-backend.onrender.com/api/health
```

---

## 💡 Pro Tips

1. **Use custom domain** in Render settings
2. **Enable HTTPS** (automatic with Render)
3. **Set up monitoring** for uptime
4. **Backup MongoDB** regularly
5. **Use strong JWT_SECRET** (64+ characters)
6. **Test thoroughly** before pushing to main
7. **Keep dependencies updated**

---

**Happy Deploying! 🚀**
