# 🚀 Quick Deploy Checklist

Follow this checklist to deploy your Sriram IAS Backend to Render.

---

## ✅ Pre-Deployment Checklist

### 1. Code Ready
- [ ] All features working locally
- [ ] Code pushed to GitHub
- [ ] `.gitignore` properly configured
- [ ] `render.yaml` created

### 2. Database Ready
- [ ] MongoDB Atlas account created
- [ ] Cluster created (free tier M0)
- [ ] Database user created
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string copied

### 3. Cloudinary Ready
- [ ] Cloudinary account active
- [ ] Cloud name noted
- [ ] API key noted
- [ ] API secret noted

### 4. Render Account
- [ ] Render account created
- [ ] GitHub connected to Render

---

## 📝 Environment Variables to Prepare

Copy and fill these out before deployment:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sriram-ias?retryWrites=true&w=majority

# JWT (Generate a random string)
JWT_SECRET=your-random-secret-key-min-32-chars

# Cloudinary (from your dashboard)
CLOUDINARY_CLOUD_NAME=dqtasamcu
CLOUDINARY_API_KEY=262836427891748
CLOUDINARY_API_SECRET=Y-5byKJ_dw4GDwjR_TUTQqL9Fs4

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 🚀 Deployment Steps (5 Minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Render

**Option A - Using Blueprint (Recommended):**
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Select your repository
4. Fill in environment variables
5. Click "Apply"

**Option B - Manual:**
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select your repository
4. Configure:
   - Name: `sriram-ias-backend`
   - Build: `npm install`
   - Start: `npm start`
5. Add environment variables
6. Click "Create Web Service"

### Step 3: Wait for Deployment
- Build time: ~1-2 minutes
- Deployment logs available in dashboard
- Wait for "Deployed" status

### Step 4: Seed Database

Use Postman or run locally:

```bash
# Create Admin User
POST https://your-app.onrender.com/api/auth/signup
{
  "name": "Super Admin",
  "email": "admin@sriramias.com",
  "password": "SecurePassword123!",
  "role": "super_admin"
}

# Login
POST https://your-app.onrender.com/api/auth/login
{
  "email": "admin@sriramias.com",
  "password": "SecurePassword123!"
}

# Create Centers (use token from login)
POST https://your-app.onrender.com/api/admin/centers
Authorization: Bearer YOUR_TOKEN
{"name": "Delhi"}

# Create Categories
POST https://your-app.onrender.com/api/admin/categories
Authorization: Bearer YOUR_TOKEN
{"name": "GS Foundation"}
```

### Step 5: Test API
```bash
GET https://your-app.onrender.com/api/health

# Should return:
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🎯 After Deployment

### Your URLs:
```
Backend: https://sriram-ias-backend.onrender.com
Health:  https://sriram-ias-backend.onrender.com/api/health
```

### Next Steps:
- [ ] Test all API endpoints
- [ ] Create test course with file uploads
- [ ] Verify Cloudinary uploads work
- [ ] Test authentication flow
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring (optional)

---

## ⚠️ Important Notes

### Free Tier Limitations:
- ⏰ Service sleeps after 15 min inactivity
- 🐌 First request after sleep: 30-50 seconds
- 💡 Use UptimeRobot to keep awake
- 💰 Upgrade to $7/month for always-on

### Security:
- ✅ Use strong `JWT_SECRET` (64+ chars)
- ✅ Keep `.env` out of GitHub
- ✅ Use HTTPS (automatic with Render)
- ✅ MongoDB IP whitelist: `0.0.0.0/0` for Render

---

## 🆘 Troubleshooting

### Build Fails:
- Check Node version compatibility
- Verify all dependencies in `package.json`
- Check build logs in Render dashboard

### App Crashes:
- Verify all environment variables set
- Check MongoDB connection string
- Review application logs

### CORS Errors:
- Update `FRONTEND_URL` in environment variables
- Check CORS configuration in `app.js`

---

## 📞 Need Help?

1. Check [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
2. Check Render logs in dashboard
3. Test locally first with production MongoDB
4. Verify all environment variables

---

**Ready to deploy? Let's go! 🚀**
